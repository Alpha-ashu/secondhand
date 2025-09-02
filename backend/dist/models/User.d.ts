import mongoose from 'mongoose';
export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: {
        city: string;
        state: string;
        country: string;
    };
    avatar?: string;
    isVerified: boolean;
    verificationDocuments?: {
        idType: 'aadhar' | 'passport' | 'driving_license';
        idNumber: string;
        documentUrl: string;
        verificationStatus: 'pending' | 'approved' | 'rejected';
        verifiedAt?: Date;
    };
    rating: {
        average: number;
        count: number;
    };
    favorites: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, mongoose.Schema<IUser, mongoose.Model<IUser, any, any, any, mongoose.Document<unknown, any, IUser, any, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IUser> & Required<{
    _id: string;
}> & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=User.d.ts.map