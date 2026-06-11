import {
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';

import Cart from '../models/CartModel';
import Plot from '../models/PlotModel';

// =========================
// Helper
// =========================

const isValidObjectId = (
  id: string,
): boolean => {
  return mongoose.Types.ObjectId.isValid(
    id,
  );
};

// =========================
// Add To Cart
// =========================

export const addToCart =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const {
        userId,
        plotId,
      } = req.body;

      if (
        !userId ||
        !plotId ||
        !isValidObjectId(
          userId,
        ) ||
        !isValidObjectId(
          plotId,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Valid userId and plotId are required',
        });
      }

      const plot: any =
        await Plot.findById(
          plotId,
        )
          .select(
            '_id status',
          )
          .lean();

      if (!plot) {
        return res.status(404).json({
          success: false,
          message:
            'Plot not found',
        });
      }

      if (
        plot.status !==
        'Available'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Plot is not available',
        });
      }

      const existingCart =
        await Cart.findOne({
          userId,
          plotId,
        }).lean();

      if (
        existingCart
      ) {
        return res.status(409).json({
          success: false,
          message:
            'Plot already exists in cart',
        });
      }

      const cartItem =
        await Cart.create(
          {
            userId,
            plotId,
          },
        );

      return res.status(201).json({
        success: true,
        message:
          'Plot added to cart successfully',
        data: cartItem,
      });
    } catch (
      error: any
    ) {
      if (
        error?.code ===
        11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            'Plot already exists in cart',
        });
      }

      console.error(
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to add plot to cart',
      });
    }
  };

// =========================
// Get Cart Items
// =========================

export const getCartItems =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const userId =
        req.params
          .userId as string;

      if (
        !isValidObjectId(
          userId,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Valid userId is required',
        });
      }

      const page =
        Number(
          req.query.page,
        ) || 1;

      const limit =
        Number(
          req.query.limit,
        ) || 20;

      const skip =
        (page - 1) *
        limit;

      const [
        cartItems,
        totalItems,
      ] =
        await Promise.all([
          Cart.find({
            userId,
          })
            .populate(
              'plotId',
              'title location sector size price image facing status',
            )
            .sort({
              createdAt:
                -1,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

          Cart.countDocuments(
            {
              userId,
            },
          ),
        ]);

      return res.status(200).json({
        success: true,
        page,
        limit,
        totalItems,
        data: cartItems,
      });
    } catch (
      error
    ) {
      console.error(
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to fetch cart items',
      });
    }
  };

// =========================
// Cart Count
// =========================

export const getCartCount =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const userId =
        req.params
          .userId as string;

      if (
        !isValidObjectId(
          userId,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Valid userId is required',
        });
      }

      const count =
        await Cart.countDocuments(
          {
            userId,
          },
        );

      return res.status(200).json({
        success: true,
        count,
      });
    } catch (
      error
    ) {
      console.error(
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to fetch cart count',
      });
    }
  };

// =========================
// Remove Cart Item
// =========================

export const removeCartItem =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const cartId =
        req.params
          .cartId as string;

      if (
        !isValidObjectId(
          cartId,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Valid cartId is required',
        });
      }

      const deletedItem =
        await Cart.findByIdAndDelete(
          cartId,
        );

      if (
        !deletedItem
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Cart item not found',
        });
      }

      return res.status(200).json({
        success: true,
        message:
          'Removed successfully',
      });
    } catch (
      error
    ) {
      console.error(
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to remove cart item',
      });
    }
  };

// =========================
// Clear Cart
// =========================

export const clearCart =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const userId =
        req.params
          .userId as string;

      if (
        !isValidObjectId(
          userId,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Valid userId is required',
        });
      }

      const result =
        await Cart.deleteMany(
          {
            userId,
          },
        );

      return res.status(200).json({
        success: true,
        deletedCount:
          result.deletedCount ||
          0,
        message:
          'Cart cleared successfully',
      });
    } catch (
      error
    ) {
      console.error(
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to clear cart',
      });
    }
  };