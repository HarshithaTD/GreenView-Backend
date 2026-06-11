import express from 'express';

import {
  createBooking,
  getMyBookings,
  getBookingSummary,
} from '../controllers/bookingController';

import { authUser } from '../middleware/authMiddleware';

const router =
  express.Router();

// ============================
// Create Booking
// ============================

router.post(
  '/',
  authUser,
  createBooking,
);

// ============================
// Get My Bookings
// ============================

router.get(
  '/my-bookings',
  authUser,
  getMyBookings,
);

// ============================
// Get Booking Summary
// ============================

router.get(
  '/:bookingId',
  authUser,
  getBookingSummary,
);

export default router;