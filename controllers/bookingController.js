const Booking = require(
  '../models/BookingModel',
);

const Plot = require(
  '../models/PlotModel',
);

// ============================
// CREATE BOOKING
// ============================

exports.createBooking =
  async ({
    userId,
    plotId,
  }) => {
    // Check Plot

    const plot =
      await Plot.findById(
        plotId,
      );

    if (!plot) {
      throw new Error(
        'Plot not found',
      );
    }

    // Prevent duplicate booking

    const existingBooking =
      await Booking.findOne({
        user: userId,
        plot: plotId,
        status: {
          $ne: 'Cancelled',
        },
      });

    if (existingBooking) {
      throw new Error(
        'You have already booked this plot',
      );
    }

    // Calculate amounts

    const bookingAmount =
      Math.round(
        plot.price * 0.1,
      );

    const gst =
      Math.round(
        bookingAmount * 0.05,
      );

    const totalAmount =
      bookingAmount + gst;

    // Create booking

    const booking =
      await Booking.create({
        user: userId,
        plot: plot._id,
        bookingAmount,
        gst,
        totalAmount,
      });

    return booking;
  };

// ============================
// GET BOOKING SUMMARY
// ============================

exports.getBooking =
  async bookingId => {
    const booking =
      await Booking.findById(
        bookingId,
      )
        .populate(
          'user',
          'name email phone',
        )
        .populate(
          'plot',
        );

    if (!booking) {
      throw new Error(
        'Booking not found',
      );
    }

    return {
      _id: booking._id,

      bookingNumber:
        booking.bookingNumber,

      status:
        booking.status,

      plot: {
        _id:
          booking.plot._id,
        title:
          booking.plot.title,
        location:
          booking.plot.location,
        size:
          booking.plot.size,
        price:
          booking.plot.price,
        image:
          booking.plot.image,
      },

      buyer: {
        fullName:
          booking.user.name,
        mobile:
          booking.user.phone,
        email:
          booking.user.email,
      },

      payment: {
        bookingAmount:
          booking.bookingAmount,
        gst:
          booking.gst,
        totalAmount:
          booking.totalAmount,
      },

      createdAt:
        booking.createdAt,
    };
  };

// ============================
// GET USER BOOKINGS
// ============================

exports.getUserBookings =
  async userId => {
    return await Booking.find({
      user: userId,
    })
      .populate('plot')
      .sort({
        createdAt: -1,
      });
  };

  exports.getMyBookings =
  async (req, res) => {
    try {
      const bookings =
        await bookingService.getUserBookings(
          req.user.id,
        );

      res.json(bookings);
    } catch (error) {
      res.status(400).json({
        message:
          error.message,
      });
    }
  };
