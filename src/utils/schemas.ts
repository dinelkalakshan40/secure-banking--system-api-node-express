import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const createAccountSchema = z.object({
  body: z.object({
    type: z.enum(['SAVINGS', 'CHECKING']),
    currency: z.string().length(3).optional(),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    fromAccountId: z.string(),
    toAccountNumber: z.string(),
    amount: z.number().positive(),
    description: z.string().max(100).optional(),
    otpCode: z.string().length(6),
  }),
});

export const withdrawSchema = z.object({
  body: z.object({
    accountId: z.string(),
    amount: z.number().positive(),
    description: z.string().max(100).optional(),
    otpCode: z.string().length(6),
  }),
});

export const depositSchema = z.object({
  body: z.object({
    accountId: z.string(),
    amount: z.number().positive(),
    description: z.string().max(100).optional(),
  }),
});
