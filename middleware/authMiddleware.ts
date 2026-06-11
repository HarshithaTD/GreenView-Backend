import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/auth';

export const authUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    console.log('AUTH HEADER:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No token',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
console.log(
  'DECODED TOKEN:',
  decoded,
);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No token',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access only',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};