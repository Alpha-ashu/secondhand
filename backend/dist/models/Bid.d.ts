import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IBid, {}, {}, {}, mongoose.Document<unknown, {}, IBid, {}, {}> & IBid & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Bid.d.ts.map