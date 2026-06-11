import mongoose, {
  Schema,
  Document,
} from 'mongoose';

export interface IEnquiry
  extends Document {
  userId: mongoose.Types.ObjectId;

  name: string;
  mobile: string;
  email?: string;
  message?: string;

  plotId: mongoose.Types.ObjectId;

  plotTitle: string;
  plotLocation: string;
  plotPrice: string;

  status?: 'New' | 'Contacted' | 'Closed';

  avatar?: string;
  adminNote?: string;

  source?: 'App' | 'Website' | 'Call' | 'WhatsApp';

  isRead?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema(
  {
    // Logged In User
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Plot Reference
    plotId: {
      type: Schema.Types.ObjectId,
      ref: 'Plot',
      required: true,
    },

    // User Details
    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: String,

    message: String,

    // Plot Details
    plotTitle: String,
    plotLocation: String,
    plotPrice: String,

    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Closed',
      ],
      default: 'New',
    },

    avatar: {
      type: String,
      default:
        'https://i.pravatar.cc/150',
    },

    adminNote: String,

    source: {
      type: String,
      enum: [
        'App',
        'Website',
        'Call',
        'WhatsApp',
      ],
      default: 'App',
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  'Enquiry',
  EnquirySchema,
);