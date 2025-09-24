import { Request, Response, NextFunction } from 'express';
import {
  checkOtpRestrictions,
  validateRegistrationData,
  trackOtpRequest,
  sendOtp,
} from '../utils/auth.helper';
import { prisma } from '../libs/prisma';
import { ValidationError } from '../appError/AppError';

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError('Email already exists', 409));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, 'user-activation-mail');
    res.status(200).json({ message: 'OTP sent to email. Please verify your account' });
  } catch (error) {
    return next(error);
  }
};
