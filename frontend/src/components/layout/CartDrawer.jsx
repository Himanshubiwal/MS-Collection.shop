import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { getImageUrl } from '../../services/api.js';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    updateQuantity,
    itemsSubtotal,
    progressToFreeShipping,
    amountNeededForFreeShipping,
    coupon,
    applyCoupon,
    FREE_SHIPPING_THRESHOLD,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput.trim());
    setPromoFeedback(res);
    setPromoInput('');
  };

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">

          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight flex items-center space-x-2">
                <span>Your Bag</span>
                <span className="text-xs font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {cartItems.reduce((a, b) => a + b.quantity, 0)} items
                </span>
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 -mr-2 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="mt-4 bg-neutral-100 p-3 rounded-lg">
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>
                  {amountNeededForFreeShipping > 0
                    ? `Add ₹${amountNeededForFreeShipping.toFixed(2)} INR more for Free Shipping`
                    : '🎉 You have unlocked Free Shipping!'}
                </span>
                <span>{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full transition-all duration-300 ease-out"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-4">
                <ShoppingBag className="w-16 h-16 stroke-1 text-neutral-300" />
                <p className="text-sm">Your shopping bag is currently empty.</p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-2 text-xs font-semibold uppercase tracking-wider text-black border-b border-black pb-0.5"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex space-x-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
                    }}
                    className="w-20 h-24 object-cover bg-neutral-100 rounded flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between text-sm">
                    <div>
                      <div className="flex justify-between items-start font-medium">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <span className="ml-2 whitespace-nowrap font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)} INR
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Size: {item.size} • Color: {item.colorName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center border border-neutral-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-50"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-center w-8">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-50"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.sku)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">

              {/* Promo code accordion */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (try MSCOLLECTION10)"
                  className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-black uppercase"
                />
                <button
                  type="submit"
                  className="bg-neutral-800 text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoFeedback && (
                <p className={`text-xs font-medium ${promoFeedback.success ? 'text-green-600' : 'text-red-500'}`}>
                  {promoFeedback.message}
                </p>
              )}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₹{itemsSubtotal.toFixed(2)} INR</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600 text-xs">
                    <span>Promo ({coupon})</span>
                    <span>-₹{(itemsSubtotal * 0.1).toFixed(2)} INR</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>Shipping</span>
                  <span>{amountNeededForFreeShipping === 0 ? 'FREE' : '₹150.00 INR'}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full bg-black text-white py-4 rounded font-medium text-sm tracking-wide hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest">
                Secure 256-bit SSL Encryption • Razorpay Payment Gateway
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
