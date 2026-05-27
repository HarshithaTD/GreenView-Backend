const mongoose = require('mongoose');

const plotSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      location: {
        type: String,
        required: true,
      },

      sector: {
        type: String,
        required: true,
      },

      size: {
        type: String,
        required: true,
      },

      price: {
        type: String,
        required: true,
      },

      facing: {
        type: String,
      },

      dimension: {
        type: String,
      },

      description: {
        type: String,
      },

      amenities: {
        parkDistance: {
          type: String,
        },

        schoolDistance: {
          type: String,
        },

        hospitalDistance: {
          type: String,
        },

        marketDistance: {
          type: String,
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
      },
    },
    {
      timestamps: true,
    },
  );

module.exports =
  mongoose.model(
    'Plot',
    plotSchema,
  );