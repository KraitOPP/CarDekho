import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload.user;
            localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            localStorage.setItem('accessToken', action.payload.accessToken);
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
