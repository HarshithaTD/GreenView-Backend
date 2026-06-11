import mongoose, { Schema, HydratedDocument, Model } from 'mongoose';

// =========================
// Cart Interface
// =========================

export interface ICart {
  userId: mongoose.Types.ObjectId;
  plotId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// For type safety when working with documents
export type CartDocument = HydratedDocument<ICart>;

// =========================
// Cart Schema
// =========================

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plotId: {
      type: Schema.Types.ObjectId,
      ref: 'Plot',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// Indexes
// =========================

// Prevent duplicate plots in user's cart
CartSchema.index({ userId: 1, plotId: 1 }, { unique: true });

// Fetch user's cart ordered by latest
CartSchema.index({ userId: 1, createdAt: -1 });

// =========================
// Model Export
// =========================

const Cart: Model<ICart> = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;