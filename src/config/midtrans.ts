export const MIDTRANS_CONFIG = {
  SNAP_URL: import.meta.env.VITE_MIDTRANS_PRODUCTION === 'true' 
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js',
  CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
  IS_PRODUCTION: import.meta.env.VITE_MIDTRANS_PRODUCTION === 'true'
};