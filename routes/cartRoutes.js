const express =
  require('express');

const router =
  express.Router();

const cartController =
  require('../controllers/CartController');

router.post('/add', cartController.addToCart);

router.get('/count/:userId', cartController.getCartCount);

router.get('/:userId', cartController.getCartItems);

router.delete('/remove/:cartId', cartController.removeCartItem);

router.delete('/clear/:userId', cartController.clearCart);

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Cart route is working',
  });
});

module.exports =
  router;