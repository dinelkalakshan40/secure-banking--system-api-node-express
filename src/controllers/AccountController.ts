import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { AccountService } from '../services/AccountService.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, currency } = req.body;
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const account = await AccountService.createAccount(userId, type, currency);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

export const getMyAccounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const accounts = await AccountService.getUserAccounts(userId);
    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
};

export const getAccountDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { accountNumber } = req.params;
    const account = await AccountService.getAccountByNumber(accountNumber);
    
    if (!account) throw new AppError('Account not found', 404);
    if (account.userId.toString() !== req.user?.userId) {
      throw new AppError('Unauthorized access to account', 403);
    }

    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};
