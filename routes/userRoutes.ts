import express, {
  Request,
  Response,
  Router,
} from 'express';

import User from '../models/RegisterModel';

const router: Router = express.Router();

// ================= UPDATE USER =================
router.put(
  '/users/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // ✅ Validate ID
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      // ✅ Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        req.body,
        {
          returnDocument: 'after',
        },
      );

      // ✅ Handle not found
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  },
);

export default router;