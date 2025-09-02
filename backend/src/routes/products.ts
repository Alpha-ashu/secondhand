import express from 'express';
import Joi from 'joi';
import Product from '../models/Product';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().max(200).required(),
  description: Joi.string().max(2000).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('electronics', 'precious_metals', 'collectibles').required(),
  condition: Joi.string().valid('New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Vintage', 'Deadstock', 'Near Mint'),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  video: Joi.string().uri(),
  location: Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().default('India')
  }).required(),
  specifications: Joi.array().items(Joi.string()),
  warranty: Joi.string(),
  brand: Joi.string(),
  model: Joi.string(),
  purity: Joi.string(),
  certification: Joi.string(),
  emergencyFund: Joi.boolean(),
  processingTime: Joi.string(),
  startingBid: Joi.number().min(0),
  auctionEndTime: Joi.date(),
  rarity: Joi.string(),
  tags: Joi.array().items(Joi.string())
});

// @route   GET /api/products
// @desc    Get all products with filtering and sorting
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      location,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      emergencyFund,
      isAuction
    } = req.query;

    // Build filter object
    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (emergencyFund === 'true') filter.emergencyFund = true;
    if (isAuction === 'true') filter.isAuction = true;

    if (minPrice || maxPrice) {
      filter.priceValue = {};
      if (minPrice) filter.priceValue.$gte = Number(minPrice);
      if (maxPrice) filter.priceValue.$lte = Number(maxPrice);
    }

    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location as string, 'i') },
        { 'location.state': new RegExp(location as string, 'i') }
      ];
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('seller', 'username rating isVerified')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'username rating isVerified location createdAt');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const productData = {
      ...req.body,
      seller: req.user!._id,
      priceValue: req.body.price
    };

    const product = new Product(productData);
    await product.save();

    await product.populate('seller', 'username rating isVerified');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (only seller)
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, priceValue: req.body.price },
      { new: true, runValidators: true }
    ).populate('seller', 'username rating isVerified');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (only seller)
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/seller/:sellerId
// @desc    Get products by seller
// @access  Public
router.get('/seller/:sellerId', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({ 
      seller: req.params.sellerId, 
      isActive: true 
    })
      .populate('seller', 'username rating isVerified')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments({ 
      seller: req.params.sellerId, 
      isActive: true 
    });

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const category = req.params.category;

    if (!['electronics', 'precious_metals', 'collectibles'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const products = await Product.find({ 
      category, 
      isActive: true 
    })
      .populate('seller', 'username rating isVerified')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments({ 
      category, 
      isActive: true 
    });

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
