import mongoose from 'mongoose';
import Transaction, { ITransaction, TransactionType, TransactionStatus } from '../models/Transaction.js';
import Account from '../models/Account.js';
import { AppError } from '../middlewares/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
  static async deposit(accountId: string, amount: number, description: string): Promise<ITransaction> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await Account.findById(accountId).session(session);
      if (!account) throw new AppError('Account not found', 404);

      // 1. Update balance
      account.balance += amount;
      await account.save({ session });

      // 2. Create transaction record
      const transaction = new Transaction({
        reference: `DEP-${uuidv4().substring(0, 8).toUpperCase()}`,
        type: TransactionType.DEPOSIT,
        amount,
        toAccountId: account._id,
        status: TransactionStatus.COMPLETED,
        description,
      });

      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async withdraw(accountId: string, amount: number, description: string): Promise<ITransaction> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await Account.findById(accountId).session(session);
      if (!account) throw new AppError('Account not found', 404);

      if (account.balance < amount) {
        throw new AppError('Insufficient balance', 400);
      }

      // 1. Update balance
      account.balance -= amount;
      await account.save({ session });

      // 2. Create transaction record
      const transaction = new Transaction({
        reference: `WTH-${uuidv4().substring(0, 8).toUpperCase()}`,
        type: TransactionType.WITHDRAWAL,
        amount,
        fromAccountId: account._id,
        status: TransactionStatus.COMPLETED,
        description,
      });

      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async transfer(fromAccountId: string, toAccountNumber: string, amount: number, description: string): Promise<ITransaction> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromAccount = await Account.findById(fromAccountId).session(session);
      const toAccount = await Account.findOne({ accountNumber: toAccountNumber }).session(session);

      if (!fromAccount) throw new AppError('Source account not found', 404);
      if (!toAccount) throw new AppError('Destination account not found', 404);

      if (fromAccount.balance < amount) {
        throw new AppError('Insufficient balance', 400);
      }

      // Double-Entry logic: Both sides must be updated atomically
      fromAccount.balance -= amount;
      toAccount.balance += amount;

      await fromAccount.save({ session });
      await toAccount.save({ session });

      const transaction = new Transaction({
        reference: `TRF-${uuidv4().substring(0, 8).toUpperCase()}`,
        type: TransactionType.TRANSFER,
        amount,
        fromAccountId: fromAccount._id,
        toAccountId: toAccount._id,
        status: TransactionStatus.COMPLETED,
        description,
      });

      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getTransactionHistory(accountId: string): Promise<ITransaction[]> {
    return Transaction.find({
      $or: [{ fromAccountId: accountId }, { toAccountId: accountId }],
    }).sort({ createdAt: -1 });
  }
}
