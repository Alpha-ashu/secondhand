import express from 'express';
import Joi from 'joi';
import Chat from '../models/Chat';
import Product from '../models/Product';
import { authenticate, AuthRequest } from '../middleware/auth';
import { io } from '../server';

const router = express.Router();

// Validation schemas
const messageSchema = Joi.object({
  content: Joi.string().max(1000).required(),
  messageType: Joi.string().valid('text', 'image', 'offer').default('text'),
  offerAmount: Joi.number().min(0)
});

const chatSchema = Joi.object({
  productId: Joi.string().required()
});

// @route   POST /api/chat
// @desc    Create or get existing chat
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { error } = chatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { productId } = req.body;
    const buyerId = req.user!._id;

    // Find the product
    const product = await Product.findById(productId).populate('seller', 'username');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sellerId = product.seller._id;

    // Check if user is trying to chat with themselves
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({ message: 'You cannot chat with yourself' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      product: productId,
      buyer: buyerId,
      seller: sellerId
    }).populate([
      { path: 'buyer', select: 'username avatar' },
      { path: 'seller', select: 'username avatar' },
      { path: 'product', select: 'name images price' }
    ]);

    if (!chat) {
      // Create new chat
      chat = new Chat({
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
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/chat/:chatId/messages
// @desc    Send a message in chat
// @access  Private
router.post('/:chatId/messages', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { error } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { content, messageType, offerAmount } = req.body;
    const senderId = req.user!._id;
    const chatId = req.params.chatId;

    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of this chat
    if (chat.buyer.toString() !== senderId.toString() && 
        chat.seller.toString() !== senderId.toString()) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // Create message
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

    // Populate the new message
    await chat.populate('messages.sender', 'username avatar');
    const newMessage = chat.messages[chat.messages.length - 1];

    // Emit real-time message
    io.to(`chat-${chatId}`).emit('message-received', {
      chatId,
      message: newMessage
    });

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/chat/user
// @desc    Get user's chats
// @access  Private
router.get('/user', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!._id;

    const chats = await Chat.find({
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
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/chat/:chatId
// @desc    Get chat messages
// @access  Private
router.get('/:chatId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const chatId = req.params.chatId;
    const userId = req.user!._id;

    const chat = await Chat.findById(chatId)
      .populate([
        { path: 'buyer', select: 'username avatar' },
        { path: 'seller', select: 'username avatar' },
        { path: 'product', select: 'name images price' },
        { path: 'messages.sender', select: 'username avatar' }
      ]);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of this chat
    if (chat.buyer._id.toString() !== userId.toString() && 
        chat.seller._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    // Mark messages as read for the current user
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

    // Paginate messages (newest first)
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
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/chat/:chatId/read
// @desc    Mark messages as read
// @access  Private
router.put('/:chatId/read', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user!._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of this chat
    if (chat.buyer.toString() !== userId.toString() && 
        chat.seller.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all messages from other user as read
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
  } catch (error) {
    next(error);
  }
});

export default router;
