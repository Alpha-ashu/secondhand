import mongoose from 'mongoose';
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
    brand?: string;
    model?: string;
    purity?: string;
    certification?: string;
    emergencyFund?: boolean;
    processingTime?: string;
    isAuction?: boolean;
    startingBid?: number;
    currentBid?: number;
    bidCount?: number;
    auctionEndTime?: Date;
    rarity?: string;
    isActive: boolean;
    isFeatured: boolean;
    viewCount: number;
    favoriteCount: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: string;
}> & {
    __v: number;
}, mongoose.Schema<IProduct, mongoose.Model<IProduct, any, any, any, mongoose.Document<unknown, any, IProduct, any, {}> & IProduct & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IProduct, mongoose.Document<unknown, {}, mongoose.FlatRecord<IProduct>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IProduct> & Required<{
    _id: string;
}> & {
    __v: number;
}>>;
export default Product;
//# sourceMappingURL=Product.d.ts.map