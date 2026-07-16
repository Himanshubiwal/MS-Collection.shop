import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Search, ShoppingBag, User, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { cartItems, setIsDrawerOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchModal(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm tracking-wide transition-colors pb-1 border-b-2 ${
      isActive
        ? 'border-black font-semibold text-black'
        : 'border-transparent text-neutral-600 hover:text-black'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Navigation Categories (Exact MS Collection layout from screenshot) */}
            <nav className="hidden lg:flex items-center space-x-8 w-1/3">
              <NavLink to="/shop" end className={navLinkClasses}>
                All
              </NavLink>
              <NavLink to="/shop?category=Tops" className={({ isActive }) =>
                `text-sm tracking-wide transition-colors pb-1 border-b-2 ${
                  window.location.search.includes('Tops') ? 'border-black font-semibold text-black' : 'border-transparent text-neutral-600 hover:text-black'
                }`
              }>
                Tops
              </NavLink>
              <NavLink to="/shop?category=Bottoms" className={({ isActive }) =>
                `text-sm tracking-wide transition-colors pb-1 border-b-2 ${
                  window.location.search.includes('Bottoms') ? 'border-black font-semibold text-black' : 'border-transparent text-neutral-600 hover:text-black'
                }`
              }>
                Bottoms
              </NavLink>
              <NavLink to="/shop?category=Accessories" className={({ isActive }) =>
                `text-sm tracking-wide transition-colors pb-1 border-b-2 ${
                  window.location.search.includes('Accessories') ? 'border-black font-semibold text-black' : 'border-transparent text-neutral-600 hover:text-black'
                }`
              }>
                Accessories
              </NavLink>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden w-1/3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-neutral-700 hover:text-black"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Center: MS Collection Brand Logo */}
            <div className="flex justify-center w-1/3">
              <Link to="/" className="text-2xl md:text-3xl font-logo tracking-tight text-black hover:opacity-90 transition-opacity">
                MS Collection
              </Link>
            </div>

            {/* Right: Brand Links, Search, Login, Cart */}
            <div className="flex items-center justify-end space-x-6 w-1/3">
              <Link
                to="/about"
                className="hidden md:inline-block text-sm tracking-wide text-neutral-600 hover:text-black transition-colors"
              >
                The brand
              </Link>

              <button
                onClick={() => setShowSearchModal(true)}
                className="text-sm tracking-wide text-neutral-600 hover:text-black transition-colors flex items-center space-x-1"
              >
                <span className="hidden md:inline">Search</span>
                <Search className="w-4 h-4 md:hidden" />
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center space-x-1 text-xs bg-black text-white px-2.5 py-1 rounded font-medium hover:bg-neutral-800 transition-colors"
                  title="Store Admin Dashboard"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {user ? (
                <Link
                  to="/account"
                  className="text-sm tracking-wide text-neutral-600 hover:text-black transition-colors flex items-center space-x-1.5"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-sm tracking-wide text-neutral-600 hover:text-black transition-colors"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative text-sm tracking-wide text-black font-medium hover:opacity-75 transition-opacity flex items-center space-x-1.5"
                aria-label="Open Cart Drawer"
              >
                <span>Cart</span>
                {totalCartCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-black text-white rounded-full">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearchSubmit}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                Search Catalog
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search St-Ambroise half tights, Oakwood longsleeve, or tees..."
                  autoFocus
                  className="w-full text-xl py-3 border-b-2 border-black focus:outline-none placeholder:text-neutral-300 pr-10 font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black hover:opacity-75"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-500">
                <span>Popular searches:</span>
                <button
                  type="button"
                  onClick={() => { setShowSearchModal(false); navigate('/shop?search=Oakwood'); }}
                  className="underline hover:text-black"
                >
                  Oakwood
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSearchModal(false); navigate('/shop?search=Tights'); }}
                  className="underline hover:text-black"
                >
                  Half Tights
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSearchModal(false); navigate('/shop?search=Track'); }}
                  className="underline hover:text-black"
                >
                  Track & Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="relative bg-white w-4/5 max-w-sm h-full shadow-xl flex flex-col justify-between p-6 overflow-y-auto z-10 animate-slideRight">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <span className="text-xl font-logo font-bold">MS Collection</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-6 text-lg font-medium">
                <NavLink
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 hover:text-black border-b border-neutral-100 pb-2"
                >
                  All Products
                </NavLink>
                <NavLink
                  to="/shop?category=Tops"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 hover:text-black border-b border-neutral-100 pb-2"
                >
                  Tops
                </NavLink>
                <NavLink
                  to="/shop?category=Bottoms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 hover:text-black border-b border-neutral-100 pb-2"
                >
                  Bottoms
                </NavLink>
                <NavLink
                  to="/shop?category=Accessories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 hover:text-black border-b border-neutral-100 pb-2"
                >
                  Accessories
                </NavLink>
                <NavLink
                  to="/lookbook"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 hover:text-black border-b border-neutral-100 pb-2"
                >
                  Lookbook SS26
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 hover:text-black border-b border-neutral-100 pb-2"
                >
                  The brand
                </NavLink>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 bg-black text-white w-full py-3 rounded text-sm font-medium"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              )}

              {user ? (
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 border border-black w-full py-3 rounded text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>My Account ({user.name})</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 bg-black text-white w-full py-3 rounded text-sm font-medium"
                >
                  <span>Sign In / Create Account</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
