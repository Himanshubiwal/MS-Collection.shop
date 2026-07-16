import React from 'react';

const VariantSelector = ({
  variants = [],
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  onOpenSizeGuide,
}) => {
  // Extract unique available sizes and colors
  const uniqueSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].filter(s =>
    variants.some(v => v.size === s)
  );
  
  const uniqueColors = Array.from(new Set(variants.map(v => v.colorHex)))
    .map(hex => variants.find(v => v.colorHex === hex))
    .filter(Boolean);

  // Check out-of-stock for selected color + size combination
  const isSizeAvailable = (size) => {
    if (!selectedColor) return variants.some(v => v.size === size && v.stockQuantity > 0);
    return variants.some(
      v => v.size === size && v.colorName === selectedColor && v.stockQuantity > 0
    );
  };

  return (
    <div className="space-y-6 pt-4 border-t border-neutral-200">
      
      {/* Color Selector */}
      {uniqueColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-neutral-600">
            <span>Color: <strong className="text-black">{selectedColor}</strong></span>
          </div>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => (
              <button
                key={color.colorHex}
                type="button"
                onClick={() => setSelectedColor(color.colorName)}
                className={`group relative flex items-center space-x-2 px-3 py-2 rounded border text-xs font-medium transition-all ${
                  selectedColor === color.colorName
                    ? 'border-black ring-1 ring-black bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-neutral-300 shadow-inner"
                  style={{ backgroundColor: color.colorHex }}
                />
                <span>{color.colorName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {uniqueSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-neutral-600">
            <span>Size: <strong className="text-black">{selectedSize || 'Select a size'}</strong></span>
            {onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="underline lowercase tracking-normal text-neutral-500 hover:text-black"
              >
                size guide
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {uniqueSizes.map((size) => {
              const available = isSizeAvailable(size);
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-semibold rounded border text-center transition-all ${
                    !available
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                      : isSelected
                      ? 'border-black bg-black text-white shadow-md'
                      : 'border-neutral-200 hover:border-black text-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default VariantSelector;
