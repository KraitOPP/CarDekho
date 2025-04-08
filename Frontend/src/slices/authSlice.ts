import { createSlice } from '@reduxjs/toolkit';

const rawUser = localStorage.getItem('userInfo');
let parsedUser = null;
if (rawUser) {
  try {
    parsedUser = JSON.parse(rawUser);
  } catch (e) {
    console.error('Failed to parse userInfo from localStorage:', e, rawUser);
    localStorage.removeItem('userInfo');
  }
}

const initialState = {
  userInfo: parsedUser,           
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload: { userInfo, accessToken } }) => {
      state.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('accessToken', accessToken);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectUser = (state) => state.auth.userInfo;
export default authSlice.reducer;
