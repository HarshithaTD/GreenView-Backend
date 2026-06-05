const bookingService = require(
  '../services/bookingService',
);

exports.createBooking = async (
  req,
  res,
) => {
  try {
    const booking =
      await bookingService.createBooking({
        userId: req.user.id,
        plotId: req.body.plotId,
      });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getBookingSummary =
  async (req, res) => {
    try {
      const booking =
        await bookingService.getBooking(
          req.params.bookingId,
        );

      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      res.status(404).json({
        message: error.message,
      });
    }
  };

exports.getMyBookings =
  async (req, res) => {
    try {
      const bookings =
        await bookingService.getUserBookings(
          req.user.id,
        );

      res.json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };