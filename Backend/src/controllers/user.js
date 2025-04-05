const { executeQuery } = require('../db/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

async function signup(req, res) {
  const { name, email, mobileNumber, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !mobileNumber || !password) {
    return res.status(400).json({ error: 'Email, mobile number, and password are required.' });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long and include at least one number and one special character.'
    });
  }

  try {
    const existingUsers = await executeQuery(
      'SELECT * FROM users WHERE email = ? OR phone_number = ?',
      [email, mobileNumber]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User with provided email or mobile number already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO users (name, email, phone_number, password)
      VALUES (?,?,?,?)
    `;
    const result = await executeQuery(insertQuery, [name, email, mobileNumber, hashedPassword]);

    return res.status(201).json({ message: 'Sign Up Successfully'});
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const users = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await executeQuery('UPDATE users SET refresh_token = ?, refresh_token_expires_at = ? WHERE id = ?', [refreshToken, refreshExpiresAt, user.id]);

    await res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:"false", maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({ message: 'Login successful', 
                                  accessToken, 
                                  userInfo:{ 
                                              id: user.id, 
                                              name: user.name, 
                                              email: user.email, 
                                              phoneNumber: user.phone_number, 
                                            } 
                                });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userId = decoded.id;

    const users = await executeQuery(
      'SELECT * FROM users WHERE id = ? AND refresh_token = ?',
      [userId, refreshToken]
    );

    if (users.length === 0) {
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    const user = users[0];

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(403).json({ error: 'Invalid or expired refresh token.' });
  }
}


async function getCurrUser(req, res) {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone_number, 
        u.license_number, 
        a.house_no,
        a.street,
        a.area,
        a.city,
        a.state,
        a.zip_code,
        a.country
      FROM users u
      LEFT JOIN addresses a 
        ON u.id = a.user_id AND a.address_type = 'permanent'
      WHERE u.id = ?
    `;
    const results = await executeQuery(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user: results[0] });
  } catch (error) {
    console.error('Error in getCurrUser:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function logout(req, res) {
  try {
    const userId = req.user.id;

    const sql = "UPDATE users SET refresh_token = NULL, refresh_token_expires_at = NULL WHERE id = ?";
    await executeQuery(sql, [userId]);

    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateProfile(req, res) {
  const userId = req.user.id;
  const { 
    email = null, 
    phoneNumber = null, 
    aadhaarImage = null, 
    licenseImage = null, 
    permanentAddress, 
    temporaryAddress 
  } = req.body;

  try {
    const updateUserQuery = `
      UPDATE users
      SET email = COALESCE(?, email),
          phone_number = COALESCE(?, phone_number),
          aadhaar_image = COALESCE(?, aadhaar_image),
          licence_image = COALESCE(?, licence_image)
      WHERE id = ?
    `;
    await executeQuery(updateUserQuery, [email, phoneNumber, aadhaarImage, licenseImage, userId]);

    async function upsertAddress(addressData, addressType) {
      if (addressData && typeof addressData === 'object') {
        const {
          house_no = null,
          street = null,
          area = null,
          city = null,
          state = null,
          zip_code = null,
          country = null
        } = addressData;

        const selectAddressQuery = `
          SELECT * FROM addresses
          WHERE user_id = ? AND address_type = ?
        `;
        const addressResults = await executeQuery(selectAddressQuery, [userId, addressType]);

        if (addressResults.length > 0) {
          const updateAddressQuery = `
            UPDATE addresses
            SET house_no = COALESCE(?, house_no),
                street = COALESCE(?, street),
                area = COALESCE(?, area),
                city = COALESCE(?, city),
                state = COALESCE(?, state),
                zip_code = COALESCE(?, zip_code),
                country = COALESCE(?, country),
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ? AND address_type = ?
          `;
          await executeQuery(updateAddressQuery, [house_no, street, area, city, state, zip_code, country, userId, addressType]);
        } else {
          const insertAddressQuery = `
            INSERT INTO addresses (user_id, address_type, house_no, street, area, city, state, zip_code, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          await executeQuery(insertAddressQuery, [userId, addressType, house_no, street, area, city, state, zip_code, country]);
        }
      }
    }

    await upsertAddress(permanentAddress, 'permanent');
    await upsertAddress(temporaryAddress, 'temporary');

    return res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error in updateProfile:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
async function getAllUsers(req, res) {
  try {
    const sql = `
      SELECT 
        id, name, email, phone_number, license_number 
      FROM users
    `;
    const users = await executeQuery(sql);

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}


module.exports = { signup, login, getCurrUser, logout, updateProfile,getAllUsers, refresh};
