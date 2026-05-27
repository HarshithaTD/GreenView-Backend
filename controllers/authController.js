const {
  registerService,
  loginService,
} = require(
  '../services/authService',
);

// ============================
// REGISTER CONTROLLER
// ============================
exports.registerController =
  async (req, res) => {
    try {
      const data =
        await registerService(
          req.body,
        );

      res.status(201).json({
        success: true,

        message:
          'Registration successful',

        ...data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  };

// ============================
// LOGIN CONTROLLER
// ============================
exports.loginController =
  async (req, res) => {
    try {
      const data =
        await loginService(
          req.body,
        );

      res.status(200).json({
        success: true,

        message:
          'Login successful',

        ...data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  };
