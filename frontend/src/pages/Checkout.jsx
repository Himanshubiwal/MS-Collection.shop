import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api, { getImageUrl } from '../services/api.js';
import { ShieldCheck, Truck, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const {
    cartItems,
    itemsSubtotal,
    shippingPrice,
    taxPrice,
    totalPrice,
    coupon,
    discountAmount,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || 'Station Road, Piprali Circle',
    city: user?.addresses?.[0]?.city || 'Sikar',
    state: user?.addresses?.[0]?.state || 'Rajasthan',
    postalCode: user?.addresses?.[0]?.postalCode || '332001',
    country: user?.addresses?.[0]?.country || 'India',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-2xl font-logo">Your bag is empty</h2>
        <p className="text-sm text-neutral-500">Add garments to your shopping bag before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block bg-black text-white px-8 py-3.5 rounded text-xs uppercase font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePaymentInitiate = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Create Razorpay order on backend
      const { data } = await api.post('/orders/create-razorpay-order', {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          size: item.size,
          colorName: item.colorName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: address,
        itemsPrice: itemsSubtotal - discountAmount,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      // 2. Check if we are in dev simulation mode or live Razorpay
      if (data.simulation || !window.Razorpay) {
        console.log('[Checkout]: Running in secure development simulation mode. Auto-verifying order.');
        const verifyRes = await api.post('/orders/verify-payment', {
          orderId: data.orderId,
          razorpayOrderId: data.razorpayOrderId,
          simulation: true,
        });

        if (verifyRes.data.success) {
          clearCart();
          navigate(`/order/${data.orderId}`);
        }
      } else {
        // Live Razorpay Checkout Modal
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'MS Collection',
          description: `Order #${data.orderId.slice(-8)}`,
          image: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png',
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            try {
              const verifyRes = await api.post('/orders/verify-payment', {
                orderId: data.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                clearCart();
                navigate(`/order/${data.orderId}`);
              }
            } catch (verErr) {
              setError('Payment verification failed. Please contact customer care.');
              setLoading(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#000000',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setError(`Payment declined: ${resp.error.description}`);
          setLoading(false);
        });
        rzp.open();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to initiate checkout';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="pb-6 border-b border-neutral-200 flex justify-between items-center">
        <h1 className="text-3xl font-logo font-normal">Secure Checkout</h1>
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-200">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-xs p-4 rounded font-medium flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">

        {/* Left: Shipping Details Form */}
        <form onSubmit={handlePaymentInitiate} className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 border-b border-neutral-200 pb-2">
              1. Shipping & Dispatch Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-medium text-neutral-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-neutral-600 mb-1">City</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-neutral-600 mb-1">Province / State</label>
                <input
                  type="text"
                  required
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-neutral-600 mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-neutral-600 mb-1">Country</label>
                <select
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  className="w-full border border-neutral-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 border-b border-neutral-200 pb-2">
              2. Payment Method
            </h2>
            <div className="p-4 border-2 border-black bg-neutral-50 rounded flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-4 border-black bg-white flex-shrink-0" />
                <div>
                  <span className="font-semibold text-sm block">Razorpay Gateway / UPI / NetBanking / Cards</span>
                  <span className="text-xs text-neutral-500">Supports INR, UPI, domestic and international secure processing</span>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing Payment...' : `Pay ₹${totalPrice.toFixed(2)} INR via Razorpay`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Right: Bag Summary */}
        <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 rounded-lg p-6 space-y-6 h-fit sticky top-28">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 pb-3 border-b border-neutral-200">
            Order Review ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.sku} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                    }}
                    className="w-12 h-14 object-cover bg-neutral-200 rounded"
                  />
                  <div>
                    <h4 className="font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity} • {item.size} / {item.colorName}</p>
                  </div>
                </div>
                <span className="font-semibold whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)} INR</span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Items Subtotal</span>
              <span>₹{itemsSubtotal.toFixed(2)} INR</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-green-600 text-xs font-medium">
                <span>Promo ({coupon})</span>
                <span>-₹{discountAmount.toFixed(2)} INR</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Shipping & Dispatch</span>
              <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)} INR`}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Estimated Tax (13%)</span>
              <span>₹{taxPrice.toFixed(2)} INR</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-200 text-black">
              <span>Total Due</span>
              <span>₹{totalPrice.toFixed(2)} INR</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
