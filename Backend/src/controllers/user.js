const { executeQuery } = require('../db/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {uploadOnCloudinary,deleteFromCloudinary}=require('../middlewares/cloudinary.js')

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
                                              role: user.role,
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
        u.licence_image,
        u.aadhaar_image,
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
    const user=results[0];
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ message:'User Information',
                                  userInfo:{
                                    id:user.id,
                                    name:user.name,
                                    email:user.email,
                                    phoneNumber:user.phone_number,
                                    licenseNumber:user.license_number,
                                    licenseImageUrl:user.licence_image,
                                    aadhaarImageUrl:user.aadhaar_image,
                                    address:{
                                      houseNumber:user.house_no,
                                      street:user.street,
                                      area:user.area,
                                      city:user.city,
                                      state:user.state,
                                      country:user.country,
                                      zipCode:user.zip_code
                                    }
                                  }
    });
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
  try {
    const userId = req.user.id;
    const {
      name, email, phoneNumber, licenseNumber,
      houseNumber, street, area, city, state, zipCode, country
    } = req.body;

    const aadhaarImage = req.files?.aadhaar_image?.[0];
    const licenseImage = req.files?.license_image?.[0];

    const existingUser = await executeQuery(`SELECT * FROM users WHERE id=?`, [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = existingUser[0];

    const updatedName = name || user.name;
    const updatedEmail = email || user.email;
    const updatedPhone = phoneNumber || user.phone_number;
    const updatedLicenseNumber = licenseNumber || user.license_number;

    let aadhaarImageUrl = user.aadhaar_image;
    let licenseImageUrl = user.licence_image;

    if (aadhaarImage) {
      if (aadhaarImageUrl) await deleteFromCloudinary(aadhaarImageUrl);
      aadhaarImageUrl = await uploadOnCloudinary(aadhaarImage.path);
    }

    if (licenseImage) {
      if (licenseImageUrl) await deleteFromCloudinary(licenseImageUrl);
      licenseImageUrl = await uploadOnCloudinary(licenseImage.path);
    }

    await executeQuery(
      `UPDATE users SET name=?, email=?, phone_number=?, license_number=?, aadhaar_image=?, licence_image=?, updated_at=NOW() WHERE id=?`,
      [updatedName, updatedEmail, updatedPhone, updatedLicenseNumber, aadhaarImageUrl, licenseImageUrl, userId]
    );

    const existingAddress = await executeQuery(`SELECT * FROM addresses WHERE user_id=?`, [userId]);

    if (houseNumber || area || street || city || state || zipCode || country) {
      if (existingAddress.length > 0) {
        await executeQuery(
          `UPDATE addresses SET house_no=?, area=?, street=?, city=?, state=?, zip_code=?, country=? 
           WHERE user_id=? AND address_type='permanent'`,
          [houseNumber, area, street, city, state, zipCode, country, userId]
        );
      } else {
        await executeQuery(
          `INSERT INTO addresses (user_id, address_type, house_no, area, street, city, state, zip_code, country) 
           VALUES (?, 'permanent', ?, ?, ?, ?, ?, ?, ?)`,
          [userId, houseNumber, area, street, city, state, zipCode, country]
        );
      }
    }

    const updatedUser = (await executeQuery(`SELECT * FROM users WHERE id=?`, [userId]))[0];
    const address = (await executeQuery(`SELECT * FROM addresses WHERE user_id=? AND address_type='permanent'`, [userId]))[0];

    return res.status(200).json({
      message: 'Updated User Information',
      userInfo: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phone_number,
        licenseNumber: updatedUser.license_number,
        licenseImageUrl: updatedUser.licence_image,
        aadhaarImageUrl: updatedUser.aadhaar_image,
        address: address ? {
          houseNumber: address.house_no,
          street: address.street,
          area: address.area,
          city: address.city,
          state: address.state,
          country: address.country,
          zipCode: address.zip_code
        } : null
      }
    });
  } catch (error) {
    console.error('UpdateProfile error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePassword(req, res) {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old and new passwords are required.' });
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      error: 'New password must be at least 8 characters long and include at least one number and one special character.'
    });
  }

  try {
    const userResults = await executeQuery('SELECT * FROM users WHERE id = ?', [userId]);
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResults[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await executeQuery(
      `UPDATE users SET password = ?, refresh_token = ?, refresh_token_expires_at = ?, updated_at = NOW() WHERE id = ?`,
      [hashedNewPassword, newRefreshToken, refreshExpiresAt, userId]
    );

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: "false", maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in updatePassword:', error.message);
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


module.exports = { signup, login, getCurrUser, logout, updateProfile,getAllUsers, refresh,updatePassword};
