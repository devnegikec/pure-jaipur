import crypto from 'crypto';
import { NextFunction } from 'express';
import { redis } from '../libs/redis';
import { ValidationError } from '../appError/AppError';
import { sendEmail } from '../utils/sendMail';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: 'user' | 'seller') => {
  const { name, email, password, phone_number, country } = data;
  if (!name || !email || !password || (userType === 'seller' && (!phone_number || !country))) {
    return new ValidationError('Missing required fields for registration');
  }
  if (!emailRegex.test(email)) {
    return new ValidationError('Invalid email format');
  }
  return true;
};

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        'Account locked due to multiple failed attempts! Try again after 30 minutes',
        429,
      ),
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError('Too many requests. Please wait 1 hour before trying again', 429),
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError('Please wait 1 minute before requesting a new OTP.', 429));
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_counter:${email}`;
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // 1 hour lock
    return next(
      new ValidationError('Too many requests. Please wait 1 hour before trying again', 429),
    );
  }

  await redis.set(otpRequestKey, (otpRequests + 1).toString(), 'EX', 3600); // Reset counter every hour
};

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  await sendEmail(email, 'Verify Your Email', template, { name, otp });
  await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, '1', 'EX', 60); // 1 minute cooldown
};
