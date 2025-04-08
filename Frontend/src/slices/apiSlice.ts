import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from './authSlice';

const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${SERVER_URL}/api/`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn('Access token expired, attempting refresh…', result.error);

    const refreshResult = await baseQuery(
      { url: 'user/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = (refreshResult.data as { accessToken: string }).accessToken;
      const currentUser = api.getState().auth.userInfo;

      api.dispatch(setCredentials({
        userInfo: currentUser,
        accessToken: newToken,
      }));

      result = await baseQuery(args, api, extraOptions);

    } else {
      console.error('Refresh token invalid, logging out…', refreshResult.error);
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: () => ({}),
});
