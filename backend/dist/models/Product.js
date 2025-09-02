"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
    brand: String,
    model: String,
    purity: String,
    certification: String,
    emergencyFund: { type: Boolean, default: false },
    processingTime: String,
    isAuction: { type: Boolean, default: false },
    startingBid: Number,
    currentBid: Number,
    bidCount: { type: Number, default: 0 },
    auctionEndTime: Date,
    rarity: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    tags: [String]
}, {
    timestamps: true
});
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ 'location.city': 1 });
productSchema.index({ 'location.state': 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: -1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.virtual('auctionStatus').get(function () {
    if (!this.isAuction)
        return null;
    const now = new Date();
    if (this.auctionEndTime && now > this.auctionEndTime) {
        return 'ended';
    }
    return 'active';
});
productSchema.pre('save', function (next) {
    if (this.category === 'collectibles' && this.isNew) {
        this.isAuction = true;
        if (!this.currentBid && this.startingBid) {
            this.currentBid = this.startingBid;
        }
        if (!this.auctionEndTime) {
            this.auctionEndTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
    }
    next();
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map