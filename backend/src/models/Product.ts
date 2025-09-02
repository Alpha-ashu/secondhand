import mongoose, { Schema } from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceValue: number;
  category: 'electronics' | 'precious_metals' | 'collectibles';
  condition?: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor' | 'Vintage' | 'Deadstock' | 'Near Mint';
  seller: mongoose.Types.ObjectId;
  images: string[];
  video?: string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  specifications?: string[];
  warranty?: string;
  
  // Category-specific fields
  // Electronics
  brand?: string;
  model?: string;
  
  // Precious metals
  purity?: string;
  certification?: string;
  emergencyFund?: boolean;
  processingTime?: string;
  
  // Collectibles (for bidding)
  isAuction?: boolean;
  startingBid?: number;
  currentBid?: number;
  bidCount?: number;
  auctionEndTime?: Date;
  rarity?: string;
  
  // Common fields
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  favoriteCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceValue: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'precious_metals', 'collectibles']
  },
  condition: {
    type: String,
    enum: ['New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Vintage', 'Deadstock', 'Near Mint']
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  video: String,
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specifications: [String],
  warranty: String,
  
  // Category-specific fields
  brand: String,
  model: String,
  purity: String,
  certification: String,
  emergencyFund: { type: Boolean, default: false },
  processingTime: String,
  
  // Auction fields
  isAuction: { type: Boolean, default: false },
  startingBid: Number,
  currentBid: Number,
  bidCount: { type: Number, default: 0 },
  auctionEndTime: Date,
  rarity: String,
  
  // Common fields
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  favoriteCount: { type: Number, default: 0 },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ 'location.city': 1 });
productSchema.index({ 'location.state': 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: -1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for auction status
productSchema.virtual('auctionStatus').get(function() {
  if (!this.isAuction) return null;
  
  const now = new Date();
  if (this.auctionEndTime && now > this.auctionEndTime) {
    return 'ended';
  }
  return 'active';
});

// Middleware to set auction defaults for collectibles
productSchema.pre('save', function(next) {
  if (this.category === 'collectibles' && this.isNew) {
    this.isAuction = true;
    if (!this.currentBid && this.startingBid) {
      this.currentBid = this.startingBid;
    }
    if (!this.auctionEndTime) {
      // Default auction duration: 7 days
      this.auctionEndTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
