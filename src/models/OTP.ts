import mongoose, { Schema, Document } from 'mongoose';

export enum OTPType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  SENSITIVE_OPERATION = 'SENSITIVE_OPERATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface IOTP extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: OTPType;
  expiresAt: Date;
  isUsed: boolean;
  metadata?: Record<string, any>;
}

const OTPSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  type: { type: String, enum: Object.values(OTPType), required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  metadata: { type: Map, of: Schema.Types.Mixed },
});

// TTL Index for automatic deletion after expiry
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>('OTP', OTPSchema);
