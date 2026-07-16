import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import CartDrawer from './components/layout/CartDrawer.jsx';

// Pages
import Home from './pages/Home.jsx';
import ShopCatalog from './pages/ShopCatalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AboutBrand from './pages/AboutBrand.jsx';
import LookbookPage from './pages/LookbookPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AccountDashboard from './pages/AccountDashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />
      <CartDrawer />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopCatalog />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<AboutBrand />} />
          <Route path="/lookbook" element={<LookbookPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
