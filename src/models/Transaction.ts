import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface ITransaction extends Document {
  reference: string;
  type: TransactionType;
  amount: number;
  currency: string;
  fromAccountId: mongoose.Types.ObjectId | null; // Null for system deposits
  toAccountId: mongoose.Types.ObjectId | null;   // Null for system withdrawals
  status: TransactionStatus;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: 'USD' },
    fromAccountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null },
    toAccountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null },
    status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.PENDING },
    description: { type: String },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

TransactionSchema.index({ reference: 1 });
TransactionSchema.index({ fromAccountId: 1 });
TransactionSchema.index({ toAccountId: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
