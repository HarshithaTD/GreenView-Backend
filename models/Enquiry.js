const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    // CUSTOMER NAME
    name: {
      type: String,
      required: true,

      trim: true,
    },

    // MOBILE NUMBER
    mobile: {
      type: String,
      required: true,

      trim: true,
    },

    // EMAIL
    email: {
      type: String,

      default: '',

      trim: true,

      lowercase: true,
    },

    // MESSAGE
    message: {
      type: String,

      default: '',

      trim: true,
    },

    // PLOT TITLE
    plotTitle: {
      type: String,
      required: true,

      trim: true,
    },

    // PLOT LOCATION
    plotLocation: {
      type: String,
      required: true,

      trim: true,
    },

    // PLOT PRICE
    plotPrice: {
      type: String,
      required: true,
    },

    // ENQUIRY STATUS
    status: {
      type: String,

      enum: [
        'New',
        'Contacted',
        'Closed',
      ],

      default: 'New',
    },

    // PROFILE IMAGE
    avatar: {
      type: String,

      default:
        'https://i.pravatar.cc/150',
    },

    // ADMIN NOTES
    adminNote: {
      type: String,

      default: '',
    },

    // SOURCE
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

    // IS READ
    isRead: {
      type: Boolean,

      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// INDEX FOR SEARCH
enquirySchema.index({
  name: 'text',

  mobile: 'text',

  plotTitle: 'text',

  plotLocation: 'text',
});

module.exports = mongoose.model(
  'Enquiry',
  enquirySchema,
);