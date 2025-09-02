import express from 'express';
import Joi from 'joi';
import Bid from '../models/Bid';
import Product from '../models/Product';
import { authenticate, AuthRequest } from '../middleware/auth';
import { io } from '../server';

const router = express.Router();

// Validation schema
const bidSchema = Joi.object({
  productId: Joi.string().required(),
  amount: Joi.number().min(0).required()
});

// @route   POST /api/bids
// @desc    Place a bid on a collectible
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { error } = bidSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { productId, amount } = req.body;
    const bidderId = req.user!._id;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is a collectible and auction is active
    if (product.category !== 'collectibles' || !product.isAuction) {
      return res.status(400).json({ message: 'This product is not available for bidding' });
    }

    // Check if auction has ended
    if (product.auctionEndTime && new Date() > product.auctionEndTime) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if bid amount is higher than current bid
    if (amount <= (product.currentBid || 0)) {
      return res.status(400).json({ 
        message: `Bid must be higher than current bid of ₹${product.currentBid}` 
      });
    }

    // Check if user is not the seller
    if (product.seller.toString() === bidderId.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own product' });
    }

    // Mark all previous bids as not winning
    await Bid.updateMany(
      { product: productId, isWinning: true },
      { isWinning: false }
    );

    // Create new bid
    const bid = new Bid({
      product: productId,
      bidder: bidderId,
      amount,
      isWinning: true
    });

    await bid.save();

    // Update product with new bid information
    product.currentBid = amount;
    product.bidCount += 1;
    await product.save();

    // Populate bid with user info
    await bid.populate('bidder', 'username');

    // Emit real-time update
    io.to(`product-${productId}`).emit('bid-update', {
      productId,
      currentBid: amount,
      bidCount: product.bidCount,
      bidder: {
        username: req.user!.username
      }
    });

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid,
      product: {
        currentBid: product.currentBid,
        bidCount: product.bidCount
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bids/product/:productId
// @desc    Get all bids for a product
// @access  Public
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const bids = await Bid.find({ product: req.params.productId })
      .populate('bidder', 'username rating')
      .sort({ amount: -1, bidTime: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Bid.countDocuments({ product: req.params.productId });

    res.json({
      success: true,
      bids,
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

// @route   GET /api/bids/user/my-bids
// @desc    Get user's bids
// @access  Private
router.get('/user/my-bids', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;

    let filter: any = { bidder: req.user!._id };
    
    if (status === 'winning') {
      filter.isWinning = true;
    } else if (status === 'lost') {
      filter.isWinning = false;
    }

    const bids = await Bid.find(filter)
      .populate({
        path: 'product',
        select: 'name images currentBid auctionEndTime category',
        populate: {
          path: 'seller',
          select: 'username'
        }
      })
      .sort({ bidTime: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Bid.countDocuments(filter);

    res.json({
      success: true,
      bids,
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

// @route   GET /api/bids/user/winning
// @desc    Get user's winning bids
// @access  Private
router.get('/user/winning', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const winningBids = await Bid.find({ 
      bidder: req.user!._id, 
      isWinning: true 
    })
      .populate({
        path: 'product',
        select: 'name images currentBid auctionEndTime category',
        populate: {
          path: 'seller',
          select: 'username phone email'
        }
      })
      .sort({ bidTime: -1 });

    res.json({
      success: true,
      winningBids
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/bids/:bidId
// @desc    Cancel a bid (only if not winning)
// @access  Private
router.delete('/:bidId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if user owns the bid
    if (bid.bidder.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this bid' });
    }

    // Check if bid is winning
    if (bid.isWinning) {
      return res.status(400).json({ message: 'Cannot cancel winning bid' });
    }

    // Soft delete
    bid.isActive = false;
    await bid.save();

    res.json({
      success: true,
      message: 'Bid cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
