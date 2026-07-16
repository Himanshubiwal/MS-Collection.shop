import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'],
    required: true,
  },
  colorName: { type: String, required: true }, // e.g., "Black", "Navy", "Stone", "Cream", "Brown"
  colorHex: { type: String, required: true },  // e.g., "#000000", "#1E293B", "#D6D3C4", "#FAF8F5", "#4A3B32"
  priceAdjustment: { type: Number, default: 0 },
  stockQuantity: { type: Number, required: true, default: 10, min: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    philosophyText: {
      type: String,
      default: 'Timeless garments shaped by rich Indian heritage and contemporary lifestyle. Designed in Sikar, Rajasthan for resilience, comfort, and distinction.',
    },
    price: {
      type: Number,
      required: [true, 'Please provide base price in INR'],
      default: 1499.0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    category: {
      type: String,
      required: true,
      enum: ['Tops', 'Bottoms', 'Accessories', 'Outerwear', 'Lookbook'],
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    variants: [variantSchema],
    fabricDetails: {
      material: { type: String, default: '100% Organic Heavyweight Cotton' },
      origin: { type: String, default: 'Made in Sikar, Rajasthan, India' },
      careInstructions: { type: String, default: 'Machine wash cold with like colors. Hang dry or tumble dry low. Do not iron directly on graphic.' },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    numReviews: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search and filtering
productSchema.index({ name: 'text', description: 'text', category: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
