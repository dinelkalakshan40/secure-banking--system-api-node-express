import OTP, { OTPType } from '../models/OTP.js';
import { generateOTP, logOTP } from '../utils/otp.js';
import { AppError } from '../middlewares/errorHandler.js';
import User from '../models/User.js';

export class OTPService {
  static async createAndSendOTP(userId: string, type: OTPType, email: string) {
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 10 minutes

    const otp = new OTP({
      userId,
      code,
      type,
      expiresAt,
    });

    await otp.save();
    logOTP(email, code, type);
    return true;
  }

  static async verifyOTP(userId: string, code: string, type: OTPType) {
    const otp = await OTP.findOne({
      userId,
      code,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    otp.isUsed = true;
    await otp.save();
    return true;
  }
}
