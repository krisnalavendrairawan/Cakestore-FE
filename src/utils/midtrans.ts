export const loadMidtransScript = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).snap) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.async = true;
    
    script.onload = () => {
      console.log('Midtrans script loaded successfully');
      resolve(true);
    };
    
    script.onerror = (err) => {
      console.error('Error loading Midtrans script:', err);
      reject(err);
    };
    
    document.body.appendChild(script);
  });
};