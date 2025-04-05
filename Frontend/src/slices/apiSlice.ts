import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${SERVER_URL}/api/`,
  credentials: 'include', 
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const errorMsg = result.error?.data?.error;
  if (errorMsg=="Token expired" && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/user/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      localStorage.setItem('accessToken', refreshResult.data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } 
    else {
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
