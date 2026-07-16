import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { CheckCircle2, Package, Truck, MapPin, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-12 bg-neutral-100 rounded w-1/2 mx-auto" />
        <div className="h-64 bg-neutral-100 rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-logo">Order Receipt Not Found</h2>
        <Link to="/shop" className="inline-block bg-black text-white px-6 py-2.5 rounded text-xs uppercase font-semibold">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      
      {/* Banner */}
      <div className="text-center space-y-3 bg-neutral-50 border border-neutral-200 p-8 rounded-lg">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
        <span className="text-xs font-semibold uppercase tracking-widest text-green-700 block">
          Payment Confirmed via Razorpay
        </span>
        <h1 className="text-3xl font-logo font-normal">Thank You for Your Order</h1>
        <p className="text-xs text-neutral-500">
          Order ID: <strong className="font-mono text-black">#{order._id}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString('en-CA')}
        </p>
      </div>

      {/* Tracking Progress */}
      <div className="p-6 border border-neutral-200 rounded space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Order Status & Dispatch Timeline
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1.5">
            <div className={`w-3 h-3 mx-auto rounded-full ${['Pending', 'Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-black' : 'bg-neutral-200'}`} />
            <span className="font-medium block">Order Placed</span>
          </div>
          <div className="space-y-1.5">
            <div className={`w-3 h-3 mx-auto rounded-full ${['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-black' : 'bg-neutral-200'}`} />
            <span className="font-medium block">Processing</span>
          </div>
          <div className="space-y-1.5">
            <div className={`w-3 h-3 mx-auto rounded-full ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-black' : 'bg-neutral-200'}`} />
            <span className="font-medium block">Dispatched</span>
          </div>
          <div className="space-y-1.5">
            <div className={`w-3 h-3 mx-auto rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-600' : 'bg-neutral-200'}`} />
            <span className="font-medium block">Delivered</span>
          </div>
        </div>
        {order.trackingNumber && (
          <p className="text-xs bg-blue-50 text-blue-800 p-3 rounded font-medium text-center">
            Tracking Number: <code className="font-mono">{order.trackingNumber}</code>
          </p>
        )}
      </div>

      {/* Items Summary */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 border-b border-neutral-200 pb-2">
          Garments Ordered
        </h3>
        <div className="space-y-4 divide-y divide-neutral-100">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="pt-4 flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-14 h-16 object-cover bg-neutral-100 rounded" />
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-xs text-neutral-500">Qty: {item.quantity} • {item.size} / {item.colorName}</p>
                </div>
              </div>
              <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)} INR</span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>₹{order.itemsPrice.toFixed(2)} INR</span>
          </div>
          <div className="flex justify-between text-neutral-600 text-xs">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)} INR`}</span>
          </div>
          <div className="flex justify-between text-neutral-600 text-xs">
            <span>Tax</span>
            <span>₹{order.taxPrice.toFixed(2)} INR</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-200">
            <span>Total Paid</span>
            <span>₹{order.totalPrice.toFixed(2)} INR</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="p-6 bg-neutral-50 rounded border border-neutral-200 flex items-start space-x-3 text-xs">
        <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block uppercase tracking-wider text-neutral-800">Dispatch Destination</span>
          <p className="mt-1 text-neutral-600 leading-relaxed">
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
        <Link to="/account" className="text-xs uppercase font-semibold tracking-wider text-neutral-600 hover:text-black">
          View All Orders
        </Link>
        <Link
          to="/shop"
          className="bg-black text-white px-6 py-3 rounded text-xs uppercase font-semibold tracking-widest hover:bg-neutral-800"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
};

export default OrderConfirmation;
