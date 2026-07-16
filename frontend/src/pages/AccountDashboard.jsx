import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { Package, LogOut, User, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';

const AccountDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.orders || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Customer Account
          </span>
          <h1 className="text-3xl font-logo font-normal mt-1">Welcome back, {user.name}</h1>
          <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
        </div>
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-black text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-neutral-800"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 hover:border-black hover:text-black transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
        
        {/* Order History */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-lg font-logo font-normal tracking-tight flex items-center space-x-2">
            <Package className="w-5 h-5 text-neutral-500" />
            <span>Order History ({orders.length})</span>
          </h2>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map(n => (
                <div key={n} className="h-28 bg-neutral-100 rounded" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 bg-neutral-50 rounded text-center space-y-4 border border-neutral-200">
              <Package className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
              <p className="text-sm text-neutral-600 font-medium">You haven't placed any orders yet.</p>
              <Link
                to="/shop"
                className="inline-block bg-black text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 border border-neutral-200 rounded hover:border-neutral-400 transition-colors bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-semibold uppercase text-neutral-500">
                        #{order._id.slice(-8)}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                      {order.isPaid && (
                        <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                          Paid via {order.paymentMethod}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {order.orderItems.length} {order.orderItems.length === 1 ? 'Garment' : 'Garments'} • ₹{order.totalPrice.toFixed(2)} INR
                    </p>
                    <p className="text-xs text-neutral-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-CA')}
                    </p>
                  </div>

                  <Link
                    to={`/order/${order._id}`}
                    className="border border-black text-black px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-all flex items-center space-x-1"
                  >
                    <span>View Receipt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile & Default Address */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center space-x-2 text-neutral-800">
              <MapPin className="w-4 h-4" />
              <span>Default Shipping Address</span>
            </h3>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="text-xs text-neutral-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-black">{user.name}</p>
                <p>{user.addresses[0].street}</p>
                <p>{user.addresses[0].city}, {user.addresses[0].state} {user.addresses[0].postalCode}</p>
                <p className="font-medium text-neutral-800">{user.addresses[0].country}</p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">No saved dispatch addresses yet. Your address will be saved during your next order.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccountDashboard;
