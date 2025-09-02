"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id)
            .select('-email -phone -verificationDocuments');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const products = await Product_1.default.find({
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
    }
    catch (error) {
        next(error);
    }
});
router.post('/favorites/:productId', auth_1.authenticate, async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const user = req.user;
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const isFavorite = user.favorites.includes(productId);
        if (isFavorite) {
            user.favorites = user.favorites.filter(id => id.toString() !== productId);
            product.favoriteCount = Math.max(0, product.favoriteCount - 1);
        }
        else {
            user.favorites.push(productId);
            product.favoriteCount += 1;
        }
        await Promise.all([user.save(), product.save()]);
        res.json({
            success: true,
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            isFavorite: !isFavorite
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/favorites', auth_1.authenticate, async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id)
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map