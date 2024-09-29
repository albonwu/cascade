// store/storeProvider.js
'use client'; // This is required for Client-side components in Next.js 13

import { Provider } from 'react-redux';
import { store } from './store';

// This is a wrapper to provide the Redux store to your app
export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
