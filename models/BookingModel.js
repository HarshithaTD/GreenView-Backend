const mongoose = require('mongoose');

const BookingSchema =
  new mongoose.Schema(
    {
      // User who booked
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true,
      },

      // Selected plot
      plot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plot',
        required: true,
      },

      // Custom booking number
      bookingNumber: {
        type: String,
        unique: true,
      },

      // Payment Details
      bookingAmount: {
        type: Number,
        required: true,
      },

      gst: {
        type: Number,
        required: true,
      },

      totalAmount: {
        type: Number,
        required: true,
      },

      // Booking Status
      status: {
        type: String,
        enum: [
          'Pending',
          'Paid',
          'Cancelled',
        ],
        default: 'Pending',
      },

      // Future payment integration
      paymentId: {
        type: String,
        default: '',
      },

      paymentStatus: {
        type: String,
        enum: [
          'Pending',
          'Success',
          'Failed',
        ],
        default: 'Pending',
      },

      // Optional admin note
      remarks: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    },
  );

// Auto-generate Booking Number

BookingSchema.pre(
  'save',
  async function (next) {
    if (!this.bookingNumber) {
      this.bookingNumber =
        'BK' +
        Date.now() +
        Math.floor(
          Math.random() * 1000,
        );
    }

    next();
  },
);

module.exports = mongoose.model(
  'booking',
  BookingSchema,
);