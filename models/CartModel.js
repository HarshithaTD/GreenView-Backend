const mongoose =
  require('mongoose');

const cartSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'User',
        required: true,
      },

      plotId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'Plot',
        required: true,
      },
    },
    {
      timestamps: true,
    },
  );

cartSchema.index(
  {
    userId: 1,
    plotId: 1,
  },
  {
    unique: true,
  },
);

cartSchema.index({
  userId: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    'Cart',
    cartSchema,
  );