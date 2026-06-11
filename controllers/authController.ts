import { Request, Response } from 'express';

import {
  registerService,
  loginService,
} from '../services/authService';

// ============================
// REGISTER CONTROLLER
// ============================
export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      ...data,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong',
    });
  }
};

// ============================
// LOGIN CONTROLLER
// ============================
export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await loginService(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...data,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong',
    });
  }
};