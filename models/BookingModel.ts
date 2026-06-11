import mongoose, { Schema, HydratedDocument, Model } from 'mongoose';

export interface IBooking {
  user: mongoose.Types.ObjectId;
  plot: mongoose.Types.ObjectId;
  bookingNumber?: string;
  bookingAmount: number;
  gst: number;
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Cancelled';
  paymentId: string;
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  remarks: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'register',
      required: true,
      index: true,  // Keep this one
    },
    plot: {
      type: Schema.Types.ObjectId,
      ref: 'plot',
      required: true,
      index: true,  // Keep this one
    },
    bookingNumber: {
      type: String,
      unique: true,  // This creates the index
      trim: true,
    },
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
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Cancelled'],
      default: 'Pending',
    },
    paymentId: {
      type: String,
      default: '',
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
      default: 'Pending',
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// REMOVE these duplicate index definitions:
// BookingSchema.index({ user: 1 });
// BookingSchema.index({ plot: 1 });
// BookingSchema.index({ bookingNumber: 1 });

// Auto Generate Booking No
BookingSchema.pre('save', function () {
  const booking = this as BookingDocument;
  if (!booking.bookingNumber) {
    booking.bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

const Booking: Model<IBooking> = mongoose.models.booking || mongoose.model<IBooking>('booking', BookingSchema);

export default Booking;