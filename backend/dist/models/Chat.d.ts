import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, {}> & IChat & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Chat.d.ts.map