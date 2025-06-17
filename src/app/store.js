// app/store.js
'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/reducers/userSlice';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const storage = typeof window !== "undefined" 
  ? createWebStorage("local") 
  : { getItem: () => null, setItem: () => {}, removeItem: () => {} };
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'Twilight',
  storage,
  whitelist: ['user'],
};
console.log("user reducer : "+userReducer);
const twilightReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, twilightReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = typeof window !== "undefined" ? persistStore(store) : null;
