import mongoose, {
  Schema,
  Document,
  Model,
} from 'mongoose';

// =========================
// Amenities Interface
// =========================

export interface IAmenities {
  parkDistance: string;
  schoolDistance: string;
  hospitalDistance: string;
  marketDistance: string;
}

// =========================
// Plot Interface
// =========================

export interface IPlot
  extends Document {
  title: string;
  location: string;
  sector: string;
  size: string;
  price:  number;
  facing: string;
  dimension: string;
  description: string;
  amenities: IAmenities;
  status:
    | 'Available'
    | 'Booked'
    | 'Sold';
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// Plot Schema
// =========================

const PlotSchema =
  new Schema<IPlot>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      sector: {
        type: String,
        required: true,
        trim: true,
      },

      size: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        trim: true,
      },

      facing: {
        type: String,
        default: '',
        trim: true,
      },

      dimension: {
        type: String,
        default: '',
        trim: true,
      },

      description: {
        type: String,
        default: '',
        trim: true,
      },

      amenities: {
        parkDistance: {
          type: String,
          default: '',
          trim: true,
        },

        schoolDistance: {
          type: String,
          default: '',
          trim: true,
        },

        hospitalDistance: {
          type: String,
          default: '',
          trim: true,
        },

        marketDistance: {
          type: String,
          default: '',
          trim: true,
        },
      },

      status: {
        type: String,
        enum: [
          'Available',
          'Booked',
          'Sold',
        ],
        default: 'Available',
      },

      image: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    },
  );

// =========================
// Indexes
// =========================

// Filter by status and latest
PlotSchema.index({
  status: 1,
  createdAt: -1,
});

// Text search
PlotSchema.index({
  title: 'text',
  location: 'text',
  sector: 'text',
});

// =========================
// Model Export
// =========================

const Plot: Model<IPlot> =
  mongoose.model<IPlot>(
    'Plot',
    PlotSchema,
  );

export default Plot;