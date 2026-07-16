import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-neutral-200 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Lookbook/Feature Photo Tiles (Replicating exact Screenshot 3 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          <Link to="/about#shipping" className="group flex flex-col space-y-3">
            <div className="aspect-square bg-neutral-100 overflow-hidden rounded">
              <img
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80"
                alt="MS Collection Shipping Boxes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-sm font-normal text-neutral-800 group-hover:underline">
              Review our shipping and returns information
            </span>
          </Link>

          <Link to="/about#contact" className="group flex flex-col space-y-3">
            <div className="aspect-square bg-neutral-100 overflow-hidden rounded">
              <img
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
                alt="Email Us Notepad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-sm font-normal text-neutral-800 group-hover:underline">
              Email our team for all inquiries
            </span>
          </Link>

          <Link to="/lookbook" className="group flex flex-col space-y-3">
            <div className="aspect-square bg-neutral-100 overflow-hidden rounded">
              <img
                src="https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80"
                alt="Spring-Summer 26 Lookbook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-sm font-normal text-neutral-800 group-hover:underline">
              Explore the Spring–Summer 26 Lookbook
            </span>
          </Link>

          <Link to="/about#press" className="group flex flex-col space-y-3">
            <div className="aspect-square bg-neutral-100 overflow-hidden rounded">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                alt="The Pacesetters Magazine Feature"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-sm font-normal text-neutral-800 group-hover:underline">
              Discover our selected features and mentions
            </span>
          </Link>

        </div>

        {/* Main Footer Links & Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-neutral-200 text-sm">
          
          {/* Column 1 */}
          <div className="md:col-span-2 flex flex-col space-y-2.5 text-neutral-600">
            <Link to="/about#contact" className="hover:text-black transition-colors">Contact Us</Link>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Instagram</a>
            <Link to="/about#faq" className="hover:text-black transition-colors">FAQs</Link>
          </div>

          {/* Column 2 */}
          <div className="md:col-span-2 flex flex-col space-y-2.5 text-neutral-600">
            <Link to="/about#shipping" className="hover:text-black transition-colors">Shipping & returns</Link>
            <Link to="/about#return" className="hover:text-black transition-colors">Start a return</Link>
          </div>

          {/* Column 3 */}
          <div className="md:col-span-3 flex flex-col space-y-2.5 text-neutral-600">
            <Link to="/about#press" className="hover:text-black transition-colors">Press</Link>
            <Link to="/about#terms" className="hover:text-black transition-colors">Terms & policies</Link>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="md:col-span-5 flex flex-col justify-start">
            <h4 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-4">
              SUBSCRIBE TO OUR NEWSLETTER
            </h4>
            {subscribed ? (
              <p className="text-sm font-medium text-green-600 animate-fadeIn">
                Thank you for subscribing to MS Collection updates!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="relative w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address here"
                  className="w-full bg-transparent border-b border-neutral-400 py-2.5 text-sm pr-20 focus:outline-none focus:border-black placeholder:text-neutral-400 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wider text-black hover:opacity-75"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar Credits & Selectors */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div className="flex items-center space-x-6">
            <span>Copyright © 2026 MS Collection • Sikar, Rajasthan</span>
            <span className="text-neutral-400">MADE IN INDIA</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400">SELECT LANGUAGE</span>
              <select className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-neutral-400">SELECT COUNTRY</span>
              <select className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer">
                <option value="INR">India (INR)</option>
                <option value="USD">United States (USD)</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
