"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const Bid_1 = __importDefault(require("../models/Bid"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const server_1 = require("../server");
const router = express_1.default.Router();
const bidSchema = joi_1.default.object({
    productId: joi_1.default.string().required(),
    amount: joi_1.default.number().min(0).required()
});
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { error } = bidSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { productId, amount } = req.body;
        const bidderId = req.user._id;
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.category !== 'collectibles' || !product.isAuction) {
            return res.status(400).json({ message: 'This product is not available for bidding' });
        }
        if (product.auctionEndTime && new Date() > product.auctionEndTime) {
            return res.status(400).json({ message: 'Auction has ended' });
        }
        if (amount <= (product.currentBid || 0)) {
            return res.status(400).json({
                message: `Bid must be higher than current bid of ₹${product.currentBid}`
            });
        }
        if (product.seller.toString() === bidderId.toString()) {
            return res.status(400).json({ message: 'You cannot bid on your own product' });
        }
        await Bid_1.default.updateMany({ product: productId, isWinning: true }, { isWinning: false });
        const bid = new Bid_1.default({
            product: productId,
            bidder: bidderId,
            amount,
            isWinning: true
        });
        await bid.save();
        product.currentBid = amount;
        product.bidCount += 1;
        await product.save();
        await bid.populate('bidder', 'username');
        server_1.io.to(`product-${productId}`).emit('bid-update', {
            productId,
            currentBid: amount,
            bidCount: product.bidCount,
            bidder: {
                username: req.user.username
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/product/:productId', async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const bids = await Bid_1.default.find({ product: req.params.productId })
            .populate('bidder', 'username rating')
            .sort({ amount: -1, bidTime: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Bid_1.default.countDocuments({ product: req.params.productId });
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/user/my-bids', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status = 'all' } = req.query;
        let filter = { bidder: req.user._id };
        if (status === 'winning') {
            filter.isWinning = true;
        }
        else if (status === 'lost') {
            filter.isWinning = false;
        }
        const bids = await Bid_1.default.find(filter)
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
        const total = await Bid_1.default.countDocuments(filter);
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
    }
    catch (error) {
        next(error);
    }
});
router.get('/user/winning', auth_1.authenticate, async (req, res, next) => {
    try {
        const winningBids = await Bid_1.default.find({
            bidder: req.user._id,
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
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:bidId', auth_1.authenticate, async (req, res, next) => {
    try {
        const bid = await Bid_1.default.findById(req.params.bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        if (bid.bidder.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this bid' });
        }
        if (bid.isWinning) {
            return res.status(400).json({ message: 'Cannot cancel winning bid' });
        }
        bid.isActive = false;
        await bid.save();
        res.json({
            success: true,
            message: 'Bid cancelled successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=bids.js.map