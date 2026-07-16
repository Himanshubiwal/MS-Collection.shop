import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImg = product.images?.[0]?.url || 'https://via.placeholder.com/600x700';
  const secondaryImg = product.images?.[1]?.url || primaryImg;

  // Extract unique color variants for swatches display
  const uniqueColors = product.variants
    ? Array.from(new Set(product.variants.map(v => v.colorHex)))
      .map(hex => product.variants.find(v => v.colorHex === hex))
    : [];

  return (
    <div
      className="group flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded">
        <img
          src={isHovered ? secondaryImg : primaryImg}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
            Featured
          </span>
        )}
      </Link>

      <div className="mt-4 flex flex-col space-y-1">
        <div className="flex justify-between items-start">
          <Link
            to={`/product/${product.slug}`}
            className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <span className="text-sm font-normal text-neutral-800 whitespace-nowrap ml-2">
            ₹{product.price.toFixed(2)} INR
          </span>
        </div>

        {product.subtitle && (
          <p className="text-xs text-neutral-500 line-clamp-1">{product.subtitle}</p>
        )}

        {/* Color swatches (Exact MS Collection minimalist detail) */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-1">
            {uniqueColors.map((color) => (
              <span
                key={color.colorHex}
                className="w-3 h-3 rounded-full border border-neutral-300 inline-block shadow-sm"
                style={{ backgroundColor: color.colorHex }}
                title={color.colorName}
              />
            ))}
            {uniqueColors.length > 3 && (
              <span className="text-[10px] text-neutral-400 pl-0.5">+{uniqueColors.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
  );
};

export default ProductCard;
