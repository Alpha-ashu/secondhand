"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const server_1 = require("../server");
const router = express_1.default.Router();
const messageSchema = joi_1.default.object({
    content: joi_1.default.string().max(1000).required(),
    messageType: joi_1.default.string().valid('text', 'image', 'offer').default('text'),
    offerAmount: joi_1.default.number().min(0)
});
const chatSchema = joi_1.default.object({
    productId: joi_1.default.string().required()
});
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { error } = chatSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { productId } = req.body;
        const buyerId = req.user._id;
        const product = await Product_1.default.findById(productId).populate('seller', 'username');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const sellerId = product.seller._id;
        if (buyerId.toString() === sellerId.toString()) {
            return res.status(400).json({ message: 'You cannot chat with yourself' });
        }
        let chat = await Chat_1.default.findOne({
            product: productId,
            buyer: buyerId,
            seller: sellerId
        }).populate([
            { path: 'buyer', select: 'username avatar' },
            { path: 'seller', select: 'username avatar' },
            { path: 'product', select: 'name images price' }
        ]);
        if (!chat) {
            chat = new Chat_1.default({
                product: productId,
                buyer: buyerId,
                seller: sellerId,
                messages: []
            });
            await chat.save();
            await chat.populate([
                { path: 'buyer', select: 'username avatar' },
                { path: 'seller', select: 'username avatar' },
                { path: 'product', select: 'name images price' }
            ]);
        }
        res.status(201).json({
            success: true,
            chat
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/:chatId/messages', auth_1.authenticate, async (req, res, next) => {
    try {
        const { error } = messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { content, messageType, offerAmount } = req.body;
        const senderId = req.user._id;
        const chatId = req.params.chatId;
        const chat = await Chat_1.default.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        if (chat.buyer.toString() !== senderId.toString() &&
            chat.seller.toString() !== senderId.toString()) {
            return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
        }
        const message = {
            sender: senderId,
            content,
            messageType,
            offerAmount,
            timestamp: new Date(),
            isRead: false
        };
        chat.messages.push(message);
        await chat.save();
        await chat.populate('messages.sender', 'username avatar');
        const newMessage = chat.messages[chat.messages.length - 1];
        server_1.io.to(`chat-${chatId}`).emit('message-received', {
            chatId,
            message: newMessage
        });
        res.status(201).json({
            success: true,
            message: newMessage
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/user', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const chats = await Chat_1.default.find({
            $or: [
                { buyer: userId },
                { seller: userId }
            ],
            isActive: true
        })
            .populate([
            { path: 'buyer', select: 'username avatar' },
            { path: 'seller', select: 'username avatar' },
            { path: 'product', select: 'name images price' }
        ])
            .sort({ 'lastMessage.timestamp': -1 });
        res.json({
            success: true,
            chats
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:chatId', auth_1.authenticate, async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const chatId = req.params.chatId;
        const userId = req.user._id;
        const chat = await Chat_1.default.findById(chatId)
            .populate([
            { path: 'buyer', select: 'username avatar' },
            { path: 'seller', select: 'username avatar' },
            { path: 'product', select: 'name images price' },
            { path: 'messages.sender', select: 'username avatar' }
        ]);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        if (chat.buyer._id.toString() !== userId.toString() &&
            chat.seller._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this chat' });
        }
        let hasUnreadMessages = false;
        chat.messages.forEach(message => {
            if (message.sender._id.toString() !== userId.toString() && !message.isRead) {
                message.isRead = true;
                hasUnreadMessages = true;
            }
        });
        if (hasUnreadMessages) {
            await chat.save();
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedMessages = chat.messages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(startIndex, endIndex);
        res.json({
            success: true,
            chat: {
                ...chat.toObject(),
                messages: paginatedMessages
            },
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: chat.messages.length,
                pages: Math.ceil(chat.messages.length / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:chatId/read', auth_1.authenticate, async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const userId = req.user._id;
        const chat = await Chat_1.default.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        if (chat.buyer.toString() !== userId.toString() &&
            chat.seller.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        let updated = false;
        chat.messages.forEach(message => {
            if (message.sender.toString() !== userId.toString() && !message.isRead) {
                message.isRead = true;
                updated = true;
            }
        });
        if (updated) {
            await chat.save();
        }
        res.json({
            success: true,
            message: 'Messages marked as read'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map