import express, {
  Request,
  Response,
  Router,
} from 'express';

import * as cartController from '../controllers/CartController';

const router: Router = express.Router();

// ================= TEST ROUTE =================

router.get(
  '/test',
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Cart route is working',
    });
  },
);

// ================= CART ROUTES =================

// Add to cart
router.post('/add', cartController.addToCart);

// Get cart count
router.get(
  '/count/:userId',
  cartController.getCartCount,
);

// Get cart items
router.get(
  '/:userId',
  cartController.getCartItems,
);

// Remove single cart item
router.delete(
  '/remove/:cartId',
  cartController.removeCartItem,
);

// Clear cart
router.delete(
  '/clear/:userId',
  cartController.clearCart,
);

export default router;