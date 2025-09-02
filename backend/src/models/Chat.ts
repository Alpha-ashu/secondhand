import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'offer';
  offerAmount?: number;
}

export interface IChat extends Document {
  _id: string;
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastMessage?: {
    content: string;
    timestamp: Date;
    sender: mongoose.Types.ObjectId;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'offer'],
    default: 'text'
  },
  offerAmount: Number
});

const chatSchema = new Schema<IChat>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  lastMessage: {
    content: String,
    timestamp: Date,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
chatSchema.index({ buyer: 1 });
chatSchema.index({ seller: 1 });
chatSchema.index({ product: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });

// Update lastMessage when new message is added
chatSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    const lastMsg = this.messages[this.messages.length - 1];
    this.lastMessage = {
      content: lastMsg.content,
      timestamp: lastMsg.timestamp,
      sender: lastMsg.sender
    };
  }
  next();
});

export default mongoose.model<IChat>('Chat', chatSchema);
