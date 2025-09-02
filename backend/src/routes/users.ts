import express from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-email -phone -verificationDocuments');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's active products
    const products = await Product.find({ 
      seller: user._id, 
      isActive: true 
    }).limit(10);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        productCount: products.length,
        recentProducts: products
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/users/favorites/:productId
// @desc    Add/remove product from favorites
// @access  Private
router.post('/favorites/:productId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const productId = req.params.productId;
    const user = req.user!;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isFavorite = user.favorites.includes(productId as any);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== productId);
      product.favoriteCount = Math.max(0, product.favoriteCount - 1);
    } else {
      // Add to favorites
      user.favorites.push(productId as any);
      product.favoriteCount += 1;
    }

    await Promise.all([user.save(), product.save()]);

    res.json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite products
// @access  Private
router.get('/favorites', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!._id)
      .populate({
        path: 'favorites',
        match: { isActive: true },
        select: 'name price images category condition seller location createdAt',
        populate: {
          path: 'seller',
          select: 'username rating'
        }
      });

    res.json({
      success: true,
      favorites: user?.favorites || []
    });
  } catch (error) {
    next(error);
  }
});

export default router;
