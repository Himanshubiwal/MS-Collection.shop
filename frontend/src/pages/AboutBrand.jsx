import React from 'react';
import HeroBanner from '../components/storefront/HeroBanner.jsx';
import { ShieldCheck, Truck, Mail, HelpCircle } from 'lucide-react';

const AboutBrand = () => {
  return (
    <div className="space-y-24 pb-16">

      {/* Brand Hero */}
      <HeroBanner
        title="MS Collection"
        subtitle="Founded in Sikar, Rajasthan to create luxury lifestyle garments shaped by rich Indian heritage and modern design."
        imageUrl="/storefront.png"
        ctaText="View Lookbook"
        ctaLink="/lookbook"
      />

      {/* Philosophy Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs uppercase font-semibold tracking-[0.25em] text-neutral-400">
          Our Heritage & Manifesto
        </span>
        <h2 className="text-3xl sm:text-5xl font-logo font-normal leading-tight">
          Shaped by Royal Heritage & Modern Elegance
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
          Drawing from our heritage in Sikar, Rajasthan, MS Collection takes inspiration from regal craftsmanship where attention to detail demands luxury, resilience, and comfort across all seasons. Every piece is engineered with precision without compromising timeless fashion style.
        </p>
      </section>

      {/* Grid Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-neutral-100 rounded overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial Magazine"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Editorial Recognition
            </span>
            <h3 className="text-3xl font-logo font-normal">
              Featured in Lifestyle & Fashion Publications
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              MS Collection garments bridge the gap between everyday luxury and refined streetwear. Our premium cotton shirts, trousers, and lifestyle essentials have become staple silhouettes across modern wardrobes in India and internationally.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Care / Shipping & Returns / FAQ Anchors */}
      <section id="shipping" className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 border-t border-neutral-200">
        <h3 className="text-2xl font-logo tracking-tight mb-8">
          Shipping & Returns Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-700">
          <div className="p-6 bg-neutral-50 rounded space-y-3">
            <div className="flex items-center space-x-2 font-semibold text-black">
              <Truck className="w-5 h-5" />
              <span>Dispatch & Express Shipping</span>
            </div>
            <p className="text-xs leading-relaxed">
              All orders are processed from our Sikar, Rajasthan hub within 24 business hours. We offer complimentary express shipping on all orders exceeding ₹2,000 INR. Orders below the threshold ship at a flat rate of ₹150 INR with live tracking.
            </p>
          </div>

          <div id="return" className="p-6 bg-neutral-50 rounded space-y-3">
            <div className="flex items-center space-x-2 font-semibold text-black">
              <ShieldCheck className="w-5 h-5" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <p className="text-xs leading-relaxed">
              Garments in unworn condition with original tags attached can be returned or exchanged within 30 days of delivery. Use our self-service return portal or email our Sikar team to generate a return label instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & FAQ */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-neutral-900 text-white rounded-lg p-8 sm:p-12 text-center space-y-6">
          <Mail className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-logo font-normal">
            Email Our Team for All Inquiries
          </h3>
          <p className="text-sm text-neutral-300 max-w-lg mx-auto">
            Whether you need sizing advice, wholesale information, or dispatch updates, our customer care specialists in Sikar, Rajasthan are ready to assist.
          </p>
          <a
            href="mailto:support@mscollection.com"
            className="inline-block bg-white text-black px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            support@mscollection.com
          </a>
        </div>
      </section>


    </div>
  );
};

export default AboutBrand;
