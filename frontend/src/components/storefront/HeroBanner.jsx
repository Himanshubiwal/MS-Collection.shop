import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({
  title = "MS Collection Fashion & Lifestyle",
  subtitle = "Timeless luxury garments shaped by our rich Rajasthani heritage. Designed in Sikar, Rajasthan for elegance, distinction, and comfort across all seasons.",
  imageUrl = "/storefront.png",
  ctaText = "Explore Collection",
  ctaLink = "/shop",
  overlayOpacity = "bg-black/30",
}) => {
  return (
    <div className="relative w-full min-h-[70vh] flex items-end justify-start overflow-hidden bg-neutral-900 text-white">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-pulse-slow transition-transform duration-1000"
      />
      <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[1px]`} />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 w-full">
        <div className="max-w-2xl space-y-6">
          <span className="inline-block text-xs uppercase font-semibold tracking-[0.25em] text-neutral-300 border-b border-neutral-300 pb-1">
            Rajasthani Heritage • SS26
          </span>
          <h1 className="text-4xl sm:text-6xl font-logo font-normal tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed max-w-xl">
            {subtitle}
          </p>
          <div className="pt-2">
            <Link
              to={ctaLink}
              className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
