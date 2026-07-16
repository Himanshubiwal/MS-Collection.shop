import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { ShieldAlert, Package, ShoppingBag, Plus, Edit2, Trash2, Upload, Check, X, Truck } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    price: 100.0,
    category: 'Tops',
    isFeatured: false,
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data } = await api.get('/products?limit=50');
        setProducts(data.products || []);
      } else {
        const { data } = await api.get('/orders/admin/all');
        setOrders(data.orders || []);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      try {
        await api.delete(`/products/id/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, trackingNum) => {
    try {
      const { data } = await api.put(`/orders/admin/${orderId}/status`, {
        orderStatus: newStatus,
        trackingNumber: trackingNum || '',
      });
      setOrders(orders.map(o => o._id === orderId ? data.order : o));
      setStatusFeedback(`Order status updated to ${newStatus}`);
      setTimeout(() => setStatusFeedback(null), 3000);
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadForm = new FormData();
    uploadForm.append('images', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, imageUrl: data.url });
      setUploading(false);
    } catch (err) {
      alert('Image upload failed');
      setUploading(false);
    }
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProd = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        subtitle: formData.subtitle,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        isFeatured: formData.isFeatured,
        images: [{ url: formData.imageUrl || 'https://via.placeholder.com/600x700', altText: formData.name, isPrimary: true }],
        variants: [
          { sku: `${formData.name.slice(0, 3).toUpperCase()}-BLK-M`, size: 'M', colorName: 'Black', colorHex: '#000000', stockQuantity: 20 },
          { sku: `${formData.name.slice(0, 3).toUpperCase()}-BLK-L`, size: 'L', colorName: 'Black', colorHex: '#000000', stockQuantity: 15 },
        ],
      };

      const { data } = await api.post('/products', newProd);
      setProducts([data.product, ...products]);
      setShowAddModal(false);
      setFormData({ name: '', slug: '', subtitle: '', description: '', price: 100, category: 'Tops', isFeatured: false, imageUrl: '' });
    } catch (err) {
      alert('Error creating product');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="pb-6 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-black text-white rounded">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo font-normal">MS Collection Admin Portal</h1>
            <p className="text-xs text-neutral-500">Manage catalog products, variants, and dispatch orders</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-neutral-100 p-1 rounded">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${activeTab === 'products' ? 'bg-white text-black shadow-sm' : 'text-neutral-600 hover:text-black'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catalog ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-neutral-600 hover:text-black'
              }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {statusFeedback && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded font-medium flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Tab 1: Products Catalog */}
      {activeTab === 'products' && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-logo font-normal">Garments Inventory</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-black text-white px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-600">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Garment Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-12 object-cover rounded bg-neutral-100" />
                    </td>
                    <td className="py-3 px-4 font-medium text-black">
                      {p.name}
                      {p.isFeatured && <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600">{p.category}</td>
                    <td className="py-3 px-4 font-semibold">₹{p.price.toFixed(2)} INR</td>
                    <td className="py-3 px-4 text-xs text-neutral-500">{p.variants?.length || 0} SKUs</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-logo font-normal">Customer Orders & Dispatch</h2>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-neutral-200 rounded p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-neutral-100 gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-black">Order #{order._id}</span>
                    <span className="ml-3 text-xs text-neutral-500">
                      Placed by {order.user?.name} ({order.user?.email}) on {new Date(order.createdAt).toLocaleDateString('en-CA')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                      {order.orderStatus}
                    </span>
                    <span className="font-semibold text-sm">₹{order.totalPrice.toFixed(2)} INR</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
                  <div>
                    <strong>Items:</strong> {order.orderItems.map(i => `${i.name} (${i.size}/${i.colorName} x${i.quantity})`).join(', ')}
                  </div>
                  <div>
                    <strong>Shipping To:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.country}
                  </div>
                </div>

                {/* Status Updater */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-semibold text-neutral-500">Update Status:</span>
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order._id, status, order.trackingNumber)}
                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${order.orderStatus === status ? 'bg-black text-white border-black' : 'bg-neutral-50 border-neutral-200 hover:border-black'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      defaultValue={order.trackingNumber || ''}
                      onBlur={(e) => handleUpdateOrderStatus(order._id, order.orderStatus, e.target.value)}
                      className="border border-neutral-300 rounded px-2.5 py-1 text-xs font-mono w-48 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-2xl p-6 z-10 animate-fadeIn space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <h3 className="font-logo font-semibold text-lg">Add New Garment to Catalog</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aberdeen Technical Longsleeve"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase mb-1">Price (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
                  >
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Heavyweight Organic Cotton"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Canadian heritage narrative and fabric composition..."
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              {/* Image uploader (Free storage) */}
              <div>
                <label className="block font-semibold uppercase mb-1">Garment Image (Upload or URL)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload local file"
                    className="flex-1 border rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                  <label className="bg-neutral-100 border border-neutral-300 px-3 py-2 rounded cursor-pointer hover:bg-neutral-200 flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Local File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded border border-neutral-300 uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded uppercase font-semibold hover:bg-neutral-800"
                >
                  Create Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
