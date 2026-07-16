import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

// Create Razorpay instance wrapper with fallback handling when keys are placeholders during dev
export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';

  if (key_id === 'rzp_test_placeholder' || key_id === 'rzp_test_YourKeyIdHere') {
    console.warn('[Razorpay Warning]: Using placeholder API keys. Checkout will run in simulation mode.');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};
