const express = require('express');

const router = express.Router();

const User = require('../models/RegisterModel');

// UPDATE USER
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
      );

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;