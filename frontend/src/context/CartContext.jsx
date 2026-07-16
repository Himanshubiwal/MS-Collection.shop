import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const FREE_SHIPPING_THRESHOLD = 2000.0;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('mscollection_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('mscollection_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product === product._id && item.sku === variant.sku
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, variant.stockQuantity || 99);
        return updated;
      } else {
        return [
          ...prev,
          {
            product: product._id,
            name: product.name,
            slug: product.slug,
            sku: variant.sku,
            size: variant.size,
            colorName: variant.colorName,
            colorHex: variant.colorHex,
            price: product.price + (variant.priceAdjustment || 0),
            quantity: Math.min(quantity, variant.stockQuantity || 99),
            maxStock: variant.stockQuantity || 99,
            image: product.images?.[0]?.url || 'https://via.placeholder.com/400',
          },
        ];
      }
    });
    setIsDrawerOpen(true); // Open slide-out drawer immediately on add
  };

  const removeFromCart = (sku) => {
    setCartItems(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.sku === sku ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mscollection_cart');
    setCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = (code) => {
    if (code?.toUpperCase() === 'MSCOLLECTION10' || code?.toUpperCase() === 'BALMORAL10') {
      const discount = itemsSubtotal * 0.1;
      setCoupon('MSCOLLECTION10 (10% OFF)');
      setDiscountAmount(discount);
      return { success: true, message: '10% discount applied!' };
    }
    return { success: false, message: 'Invalid promo code' };
  };

  const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalSubtotal = Math.max(0, itemsSubtotal - discountAmount);
  const shippingPrice = finalSubtotal >= FREE_SHIPPING_THRESHOLD || finalSubtotal === 0 ? 0 : 15.0;
  const taxPrice = Number((finalSubtotal * 0.13).toFixed(2)); // Standard 13% tax calculation
  const totalPrice = Number((finalSubtotal + shippingPrice + taxPrice).toFixed(2));

  const progressToFreeShipping = Math.min(100, (itemsSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - itemsSubtotal);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        coupon,
        discountAmount,
        itemsSubtotal,
        finalSubtotal,
        shippingPrice,
        taxPrice,
        totalPrice,
        progressToFreeShipping,
        amountNeededForFreeShipping,
        FREE_SHIPPING_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
