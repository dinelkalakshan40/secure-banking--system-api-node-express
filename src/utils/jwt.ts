import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as any });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as any });
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, REFRESH_SECRET);
};
