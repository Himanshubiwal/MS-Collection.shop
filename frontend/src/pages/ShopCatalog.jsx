import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/storefront/ProductCard.jsx';
import api from '../services/api.js';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

const ShopCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'All';
  const sizeParam = searchParams.get('size') || 'ALL';
  const colorParam = searchParams.get('color') || 'ALL';
  const sortParam = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (categoryParam !== 'All') params.append('category', categoryParam);
        if (sizeParam !== 'ALL') params.append('size', sizeParam);
        if (colorParam !== 'ALL') params.append('color', colorParam);
        if (sortParam) params.append('sort', sortParam);
        if (searchQuery) params.append('search', searchQuery);

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch catalog products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam, sizeParam, colorParam, sortParam, searchQuery]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'ALL' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="pb-8 border-b border-neutral-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'The Collection'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-logo tracking-tight mt-1">
            {categoryParam === 'All' ? 'Complete MS Collection Catalog' : categoryParam}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {products.length} {products.length === 1 ? 'garment available' : 'garments available'}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center space-x-2 border border-neutral-300 px-4 py-2 rounded text-xs font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-400 font-medium">SORT BY:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 py-2 px-3 rounded font-medium focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="newest">New Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-10">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block space-y-8 pr-6 border-r border-neutral-100">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Filters
            </span>
            {(categoryParam !== 'All' || sizeParam !== 'ALL' || colorParam !== 'ALL' || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-xs underline text-neutral-500 hover:text-black"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Category</h3>
            <div className="flex flex-col space-y-2 text-sm font-medium">
              {['All', 'Tops', 'Bottoms', 'Accessories', 'Outerwear'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`text-left py-1 transition-colors ${
                    categoryParam === cat ? 'text-black font-semibold pl-2 border-l-2 border-black' : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Size</h3>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateParam('size', size)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                    sizeParam === size
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 hover:border-black text-neutral-700'
                  }`}
                >
                  {size === 'ALL' ? 'Any' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Color</h3>
            <div className="flex flex-col space-y-2 text-sm">
              {[
                { name: 'ALL', label: 'All Colors' },
                { name: 'Black', hex: '#000000' },
                { name: 'Navy', hex: '#1E293B' },
                { name: 'Stone', hex: '#D6D3C4' },
                { name: 'Royal Blue', hex: '#2563EB' },
                { name: 'Brown', hex: '#4A3B32' },
                { name: 'White', hex: '#FFFFFF' },
              ].map((color) => (
                <button
                  key={color.name}
                  onClick={() => updateParam('color', color.name)}
                  className={`flex items-center space-x-2 text-left py-1 text-xs transition-colors ${
                    colorParam === color.name ? 'font-semibold text-black' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {color.hex && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                  )}
                  <span>{color.label || color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Slide-out Filters */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="relative bg-white w-4/5 max-w-xs h-full p-6 shadow-xl overflow-y-auto z-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                  <span className="font-logo font-semibold text-lg">Filter Options</span>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>
                {/* Same filter actions as desktop */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase">Category</h3>
                  {['All', 'Tops', 'Bottoms', 'Accessories', 'Outerwear'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { updateParam('category', cat); setShowMobileFilters(false); }}
                      className={`block w-full text-left py-1 text-sm ${categoryParam === cat ? 'font-semibold text-black' : 'text-neutral-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-black text-white py-3 rounded text-xs font-semibold uppercase"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-neutral-100 rounded" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                  <div className="h-3 bg-neutral-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded text-center text-sm">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-neutral-50 rounded-lg">
              <p className="text-neutral-500 font-medium">
                No garments found matching your selected criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-black text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ShopCatalog;
