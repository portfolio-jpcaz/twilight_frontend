'use client';

import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/app/store';

// this component will be loaded on client side only
export default function ClientPersistGate({ children }) {
  console.log("Persistor in ClientPersistGate:", persistor); 
  if (!persistor) return null;  // Protection anti-hydration mismatch
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}