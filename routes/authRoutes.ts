import express from 'express';

import {
  registerController,
  loginController,
} from '../controllers/authController';

const router =
  express.Router();

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

export default router;