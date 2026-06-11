import Booking, {
  IBooking,
} from '../models/BookingModel';

import Plot, {
  IPlot,
} from '../models/PlotModel';

import { IRegister } from '../models/RegisterModel';

// ============================
// Interfaces
// ============================

interface CreateBookingPayload {
  userId: string;
  plotId: string;
}

// ============================
// CREATE BOOKING
// ============================

export const createBooking = async (
  data: CreateBookingPayload,
): Promise<IBooking> => {
  const plot = await Plot.findById(
    data.plotId,
  );

  if (!plot) {
    throw new Error(
      'Plot not found',
    );
  }

  const bookingAmount =
    Math.round(plot.price * 0.1);

  const gst = Math.round(
    bookingAmount * 0.05,
  );

  const totalAmount =
    bookingAmount + gst;

  const booking =
    await Booking.create({
      user: data.userId,
      plot: plot._id,
      bookingAmount,
      gst,
      totalAmount,
    });

  return booking;
};

// ============================
// GET USER BOOKINGS
// ============================

export const getUserBookings =
  async (
    userId: string,
  ): Promise<IBooking[]> => {
    return await Booking.find({
      user: userId,
    })
      .populate('plot')
      .sort({
        createdAt: -1,
      });
  };

// ============================
// GET SINGLE BOOKING
// ============================

export const getBooking =
  async (bookingId: string) => {
    const booking =
      await Booking.findById(
        bookingId,
      )
        .populate<{
          user: IRegister;
        }>(
          'user',
          'name email phone',
        )
        .populate<{
          plot: IPlot;
        }>('plot');

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