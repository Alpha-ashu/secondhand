import mongoose, { Document, Schema } from 'mongoose';

export interface IBid extends Document {
  _id: string;
  product: mongoose.Types.ObjectId;
  bidder: mongoose.Types.ObjectId;
  amount: number;
  isWinning: boolean;
  isActive: boolean;
  bidTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new Schema<IBid>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  bidder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  isWinning: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bidTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
bidSchema.index({ product: 1, amount: -1 });
bidSchema.index({ bidder: 1 });
bidSchema.index({ bidTime: -1 });

export default mongoose.model<IBid>('Bid', bidSchema);
