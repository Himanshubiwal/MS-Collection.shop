import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/storefront/HeroBanner.jsx';
import ProductCard from '../components/storefront/ProductCard.jsx';
import api from '../services/api.js';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products/featured');
        setFeaturedProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load catalog');
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-12">
      
      {/* 1. Full-Width Atmospheric Hero Banner (Screenshot 4 aesthetic) */}
      <HeroBanner
        title="MS Collection Fashion & Lifestyle"
        subtitle="Timeless luxury garments shaped by our rich Rajasthani heritage. Designed in Sikar, Rajasthan for elegance, distinction, and comfort across all seasons."
        imageUrl="/storefront.png"
        ctaText="Shop New Collection"
        ctaLink="/shop"
      />

      {/* 2. Editorial Quote Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-4">
          Philosophy & Origin
        </span>
        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-logo font-normal leading-relaxed text-neutral-900 tracking-tight">
          “MS Collection was founded in Sikar, Rajasthan to craft timeless garments blending rich Indian heritage with modern lifestyle design. Drawing from royal traditions and vibrant culture, every piece is engineered for elegance and resilience.”
        </blockquote>
      </section>

      {/* 3. Featured Products Grid (Replicating Screenshot 1 exact 3-column layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-logo font-normal tracking-tight">
              Featured Garments
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Select luxury essentials from our Rajasthani catalog
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-widest text-black flex items-center space-x-1 group hover:opacity-75"
          >
            <span>View All ({featuredProducts.length} items)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-neutral-100 rounded" />
                <div className="h-4 bg-neutral-200 rounded w-2/3" />
                <div className="h-3 bg-neutral-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded text-center text-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Category Discovery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-logo tracking-tight mb-8 text-neutral-900">
          Explore by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/shop?category=Tops"
            className="group relative aspect-[16/11] bg-neutral-900 overflow-hidden rounded shadow-sm flex items-end p-8 text-white"
          >
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
              alt="Tops"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 space-y-1">
              <span className="text-xs uppercase tracking-widest text-neutral-300">Category</span>
              <h3 className="text-2xl font-logo font-normal">Tops & Longsleeves</h3>
              <p className="text-xs text-neutral-300 font-light">Heavyweight organic cotton tees & half zips</p>
            </div>
          </Link>

          <Link
            to="/shop?category=Bottoms"
            className="group relative aspect-[16/11] bg-neutral-900 overflow-hidden rounded shadow-sm flex items-end p-8 text-white"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
              alt="Bottoms"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 space-y-1">
              <span className="text-xs uppercase tracking-widest text-neutral-300">Category</span>
              <h3 className="text-2xl font-logo font-normal">Half Tights & Shorts</h3>
              <p className="text-xs text-neutral-300 font-light">Italian compression performance gear</p>
            </div>
          </Link>

          <Link
            to="/shop?category=Outerwear"
            className="group relative aspect-[16/11] bg-neutral-900 overflow-hidden rounded shadow-sm flex items-end p-8 text-white"
          >
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
              alt="Outerwear"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 space-y-1">
              <span className="text-xs uppercase tracking-widest text-neutral-300">Category</span>
              <h3 className="text-2xl font-logo font-normal">Winter Outerwear</h3>
              <p className="text-xs text-neutral-300 font-light">Brushed fleece crewnecks & pullovers</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 5. Store Pillars Bar */}
      <section className="bg-neutral-50 border-y border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="p-3 bg-white rounded-full border border-neutral-200 shadow-sm">
                <Truck className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide">Free Shipping Over ₹2,000 INR</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Complimentary express delivery across India and international destinations.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="p-3 bg-white rounded-full border border-neutral-200 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide">Razorpay Secure Checkout</h4>
                <p className="text-xs text-neutral-500 mt-0.5">256-bit encrypted transactions supporting major cards and international currencies.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="p-3 bg-white rounded-full border border-neutral-200 shadow-sm">
                <RefreshCw className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide">30-Day Canadian Returns</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Hassle-free return & exchange portal with prepaid dispatch tags.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
