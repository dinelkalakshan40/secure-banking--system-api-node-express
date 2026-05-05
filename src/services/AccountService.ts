import mongoose from 'mongoose';
import Account, { IAccount, AccountType } from '../models/Account.js';
import { v4 as uuidv4 } from 'uuid';

export class AccountService {
  static async createAccount(userId: string, type: AccountType, currency: string = 'USD'): Promise<IAccount> {
    const accountNumber = this.generateAccountNumber();
    const account = new Account({
      userId,
      accountNumber,
      accountType: type,
      balance: 0,
      currency,
    });
    return account.save();
  }

  static async getAccountByNumber(accountNumber: string): Promise<IAccount | null> {
    return Account.findOne({ accountNumber });
  }

  static async getUserAccounts(userId: string): Promise<IAccount[]> {
    return Account.find({ userId });
  }

  private static generateAccountNumber(): string {
    // Generate a unique 10-digit account number
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
}
