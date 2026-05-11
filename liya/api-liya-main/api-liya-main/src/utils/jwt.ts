import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as any) || '7d';

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};