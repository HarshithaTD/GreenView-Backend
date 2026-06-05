const express =
  require('express');

const router =
  express.Router();

const bookingController =
  require(
    '../controllers/bookingController',
  );

const {
  authUser,
} = require(
  '../middleware/authMiddleware',
);

// Create Booking

router.post(
  '/',
  authUser,
  bookingController.createBooking,
);

// Get Booking Summary

router.get(
  '/my-bookings',
  authUser,
  bookingController.getMyBookings,
);

router.get(
  '/:bookingId',
  authUser,
  bookingController.getBookingSummary,
);

module.exports = router;