const Booking =
  require('../models/BookingModel');

const Plot =
  require('../models/PlotModel');

exports.createBooking =
  async userId => {
    const plot =
      await Plot.findById(
        userId.plotId,
      );

    if (!plot) {
      throw new Error(
        'Plot not found',
      );
    }

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

    const booking =
      await Booking.create({
        user: userId.userId,
        plot: plot._id,
        bookingAmount,
        gst,
        totalAmount,
      });

    return booking;
  };

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

      plot: {
        _id: booking.plot._id,
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
        gst: booking.gst,
        totalAmount:
          booking.totalAmount,
      },
    };
  };