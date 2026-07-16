import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, search, and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, size, color, sort, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Search by keyword
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by variant size or color
    if (size || color) {
      query.variants = { $elemMatch: {} };
      if (size && size !== 'ALL') {
        query.variants.$elemMatch.size = size.toUpperCase();
      }
      if (color && color !== 'ALL') {
        query.variants.$elemMatch.colorName = { $regex: color, $options: 'i' };
      }
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting setup
    let sortOption = { createdAt: -1 }; // Default: New arrivals
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch featured products for Homepage / Lookbook
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by slug or ID
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product;

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    } else {
      product = await Product.findOne({ slug: slug.toLowerCase() });
    }

    if (product) {
      res.json({
        success: true,
        product,
      });
    } else {
      res.status(404);
      throw new Error('Product not found in catalog');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (product) {
      res.json({
        success: true,
        product,
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
      res.json({
        success: true,
        message: 'Product permanently removed from catalog',
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
