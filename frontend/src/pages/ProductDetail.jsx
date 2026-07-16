import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VariantSelector from '../components/storefront/VariantSelector.jsx';
import SizeGuideModal from '../components/storefront/SizeGuideModal.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../services/api.js';
import { Truck, ShieldCheck, RefreshCw, Star, ChevronDown, Check, AlertCircle } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart, FREE_SHIPPING_THRESHOLD } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({ details: true, shipping: false });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/products/${slug}`);
        const p = data.product;
        setProduct(p);
        setSelectedImage(p.images?.[0]?.url || '');
        if (p.variants && p.variants.length > 0) {
          setSelectedSize(p.variants[0].size);
          setSelectedColor(p.variants[0].colorName);
        }
        setLoading(false);
      } catch (err) {
        setError('Garment not found in catalog');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[4/5] bg-neutral-100 rounded" />
        <div className="space-y-6">
          <div className="h-6 bg-neutral-200 rounded w-3/4" />
          <div className="h-4 bg-neutral-100 rounded w-1/4" />
          <div className="h-32 bg-neutral-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-logo">{error || 'Product Not Found'}</h2>
        <Link to="/shop" className="inline-block bg-black text-white px-6 py-3 rounded text-xs uppercase font-semibold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const activeVariant = product.variants?.find(
    v => v.size === selectedSize && v.colorName === selectedColor
  ) || product.variants?.[0];

  const inStock = activeVariant ? activeVariant.stockQuantity > 0 : false;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, activeVariant || { sku: product.slug, size: selectedSize, colorName: selectedColor }, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-500 mb-8 flex items-center space-x-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
        <span>/</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-20 flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`aspect-[4/5] sm:w-full rounded overflow-hidden border-2 transition-all ${
                    selectedImage === img.url ? 'border-black' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Image */}
          <div className="flex-1 aspect-[4/5] bg-neutral-100 rounded overflow-hidden relative shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              {product.category} • Canadian Performance
            </span>
            <h1 className="text-3xl sm:text-4xl font-logo tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-semibold">
                ₹{product.price.toFixed(2)} INR
              </span>
              {product.rating > 0 && (
                <div className="flex items-center text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                  <span>{product.rating} ({product.numReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Free Shipping Notice */}
            {product.price >= FREE_SHIPPING_THRESHOLD ? (
              <div className="flex items-center space-x-2 text-xs text-green-700 bg-green-50 p-3 rounded font-medium border border-green-200">
                <Truck className="w-4 h-4 flex-shrink-0" />
                <span>This item qualifies for complimentary express free shipping!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded font-medium border border-neutral-200">
                <Truck className="w-4 h-4 flex-shrink-0" />
                <span>Add ₹{(FREE_SHIPPING_THRESHOLD - product.price).toFixed(2)} INR more to your order for Free Shipping across India.</span>
              </div>
            )}

            <p className="text-sm text-neutral-700 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Variant Matrix Selector */}
          <VariantSelector
            variants={product.variants || []}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />

          {/* Add to Bag CTA Button */}
          <div className="space-y-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-4 rounded text-sm font-semibold tracking-widest uppercase transition-all shadow-lg ${
                inStock
                  ? 'bg-black text-white hover:bg-neutral-800 hover:shadow-xl'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {inStock ? 'Add to Bag' : 'Out of Stock'}
            </button>
            <p className="text-[11px] text-center text-neutral-500 uppercase tracking-wider">
              {inStock
                ? `In Stock • Ready for dispatch from Sikar, Rajasthan`
                : 'Selected size/color currently unavailable'}
            </p>
          </div>

          {/* Accordion Sections for Shipping, Returns, and Fabric Philosophy */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200 text-sm">
            <div className="py-4">
              <button
                onClick={() => setAccordionOpen(p => ({ ...p, details: !p.details }))}
                className="w-full flex justify-between items-center font-medium uppercase tracking-wider text-xs"
              >
                <span>Garment Philosophy & Fabric</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${accordionOpen.details ? 'rotate-180' : ''}`} />
              </button>
              {accordionOpen.details && (
                <div className="mt-3 text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <p>{product.philosophyText || 'Crafted for elegance and comfort in all seasons across Rajasthan.'}</p>
                  <p>• Premium organic fabrics & refined tailoring</p>
                  <p>• Designed in Sikar, Rajasthan, crafted for royal lifestyle & elegance</p>
                </div>
              )}
            </div>

            <div className="py-4">
              <button
                onClick={() => setAccordionOpen(p => ({ ...p, shipping: !p.shipping }))}
                className="w-full flex justify-between items-center font-medium uppercase tracking-wider text-xs"
              >
                <span>Shipping & Returns</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${accordionOpen.shipping ? 'rotate-180' : ''}`} />
              </button>
              {accordionOpen.shipping && (
                <div className="mt-3 text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <p>• Orders dispatched within 24 hours from our Sikar dispatch hub.</p>
                  <p>• 30-day return window for unworn items in original packaging.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
