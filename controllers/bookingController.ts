import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';
import { AuthRequest } from '../types/auth';


export const createBooking = async (
  req: AuthRequest,  // Changed from Request to AuthRequest
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const booking = await bookingService.createBooking({
      userId: req.user.id,
      plotId: req.body.plotId,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
};

export const getBookingSummary = async (
  req: AuthRequest,  // Changed from Request to AuthRequest
  res: Response,
): Promise<void> => {
  try {
    const booking = await bookingService.getBooking(req.params.bookingId as string);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
};

export const getMyBookings = async (
  req: AuthRequest,  // Changed from Request to AuthRequest
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const bookings = await bookingService.getUserBookings(req.user.id);

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
};