import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middlewares/errorHandler.js';
import { OTPService } from '../services/OTPService.js';
import { OTPType } from '../models/OTP.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('User already exists', 400);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = new User({ firstName, lastName, email, passwordHash });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, firstName, lastName, email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user._id, firstName: user.firstName, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const requestOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as any).user;
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    await OTPService.createAndSendOTP(userId, OTPType.SENSITIVE_OPERATION, user.email);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};
