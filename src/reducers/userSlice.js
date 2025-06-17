// features/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
  user: null,
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken: (state, action)=> {
      state.accessToken= action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, setAccessToken, logout } = userSlice.actions;
export default userSlice.reducer;
