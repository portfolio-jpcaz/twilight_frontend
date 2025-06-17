'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import dynamic from 'next/dynamic';
// dynamic import of PersistGate component on client side only
const ClientPersistGate = dynamic(
  () => import('@/components/ClientPersistGate'),
  { ssr: false } // no server rendering
);

export default function Providers({ children }) {

  return (
    <Provider store={store}>
      <ClientPersistGate >
        {children}
      </ClientPersistGate>
    </Provider>
  );
}