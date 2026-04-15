export const loadRazorpay = async (options) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const rzp = new window.Razorpay({
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        order_id: options.orderId,
        name: options.name,
        description: options.description,
        handler: options.handler,
        prefill: options.prefill,
        theme: { color: '#b8860b' }
      });
      rzp.open();
      rzp.on('payment.failed', () => {
        resolve(false);
      });
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};