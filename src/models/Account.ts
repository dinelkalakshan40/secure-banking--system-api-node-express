import mongoose, { Schema, Document } from 'mongoose';

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
  SYSTEM = 'SYSTEM',
}

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true, unique: true },
    accountType: { type: String, enum: Object.values(AccountType), default: AccountType.CHECKING },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index for faster lookups
AccountSchema.index({ userId: 1, accountNumber: 1 });

export default mongoose.model<IAccount>('Account', AccountSchema);
