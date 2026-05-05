import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { TransactionService } from '../services/TransactionService.js';
import { OTPService } from '../services/OTPService.js';
import { OTPType } from '../models/OTP.js';
import { AppError } from '../middlewares/errorHandler.js';
import Account from '../models/Account.js';

export const deposit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { accountId, amount, description } = req.body;
    const transaction = await TransactionService.deposit(accountId, amount, description);
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { accountId, amount, description, otpCode } = req.body;
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Verify OTP for withdrawal
    await OTPService.verifyOTP(userId, otpCode, OTPType.SENSITIVE_OPERATION);

    const transaction = await TransactionService.withdraw(accountId, amount, description);
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const transfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description, otpCode } = req.body;
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Security: Verify source account ownership
    const account = await Account.findById(fromAccountId);
    if (!account || account.userId.toString() !== userId) {
      throw new AppError('Unauthorized source account', 403);
    }

    // Verify OTP for transfer
    await OTPService.verifyOTP(userId, otpCode, OTPType.SENSITIVE_OPERATION);

    const transaction = await TransactionService.transfer(fromAccountId, toAccountNumber, amount, description);
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;
    
    // Security: Verify account ownership
    const account = await Account.findById(accountId);
    if (!account || account.userId.toString() !== req.user?.userId) {
      throw new AppError('Unauthorized access to account history', 403);
    }

    const history = await TransactionService.getTransactionHistory(accountId);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
