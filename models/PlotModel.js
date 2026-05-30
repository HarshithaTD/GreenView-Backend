const mongoose = require('mongoose');

const plotSchema =
  new mongoose.Schema(
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
        type: String,
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

plotSchema.index({
  status: 1,
  createdAt: -1,
});

plotSchema.index({
  title: 'text',
  location: 'text',
  sector: 'text',
});

module.exports =
  mongoose.model(
    'Plot',
    plotSchema,
  );
