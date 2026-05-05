import crypto from 'crypto';

export const generateOTP = (length: number = 6): string => {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
};

export const logOTP = (email: string, otp: string, type: string) => {
  console.log(`
  -----------------------------------------------
  [MOCK EMAIL SERVICE]
  To: ${email}
  Subject: Your Security Code
  Body: Your ${type} OTP is: ${otp}. It expires in 10 minutes.
  -----------------------------------------------
  `);
};
