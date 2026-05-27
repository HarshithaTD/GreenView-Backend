const express = require('express');

const router = express.Router();

const {
  registerController,
  loginController,
} = require(
  '../controllers/authController',
);

// ============================
// USER LOGIN
// ============================
router.post(
  '/auth/login',
  loginController,
);

// ============================
// ADMIN LOGIN
// ============================
router.post(
  '/admin/login',
  loginController,
);

// ============================
// REGISTER
// ============================
router.post(
  '/auth/register',
  registerController,
);

module.exports = router;