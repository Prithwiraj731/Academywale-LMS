import { API_URL } from '../api';

export const loadRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    const rzpOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: options.amount,
      currency: options.currency || 'INR',
      name: 'AcademyWale',
      description: options.description || 'Course Purchase',
      order_id: options.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_URL}/api/purchase/razorpay-verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              userId: options.userId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: options.courseId,
              cartItems: options.cartItems,
              amount: options.payableAmount,
              coupon: options.coupon,
              discountPercent: options.discountPercent,
              userDetails: options.userDetails,
              courseDetails: options.courseDetails
            })
          });

          const data = await verifyRes.json();
          if (verifyRes.ok && data.success) {
            resolve({ success: true, data });
          } else {
            reject(new Error(data.message || 'Payment verification failed'));
          }
        } catch (err) {
          reject(new Error('Server verification failed'));
        }
      },
      prefill: {
        name: options.prefillName || '',
        email: options.prefillEmail || '',
        contact: options.prefillPhone || ''
      },
      theme: {
        color: '#20b2aa'
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by user'));
        }
      }
    };

    const rzp = new window.Razorpay(rzpOptions);
    rzp.open();
  });
};
