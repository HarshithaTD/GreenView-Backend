const RegisterModel = require(
  '../models/RegisterModel',
);

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

// ============================
// REGISTER SERVICE
// ============================
exports.registerService = async (
  body,
) => {
  const {
    name,
    email,
    password,
    phone,
    role,
  } = body;

  if (!name || !email || !password) {
    throw new Error(
      'Name, email and password are required',
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  // CHECK USER
  const existingUser =
    await RegisterModel.findOne({
      email: normalizedEmail,
    });

  if (existingUser) {
    throw new Error(
      'User already exists',
    );
  }

  // HASH PASSWORD
  const hashedPassword =
    await bcrypt.hash(password, 10);

  // CREATE USER
  const user =
    await RegisterModel.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: role || 'user',
    });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

// ============================
// LOGIN SERVICE
// ============================
exports.loginService = async (
  body,
) => {
  const {email, password} = body;

  if (!email || !password) {
    throw new Error(
      'Email and password are required',
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  // FIND USER
  const user =
    await RegisterModel.findOne({
      email: normalizedEmail,
    });

  if (!user) {
    throw new Error(
      'Invalid credentials',
    );
  }

  // CHECK PASSWORD
  const isMatch =
    await bcrypt.compare(
      password,
      user.password,
    );

  if (!isMatch) {
    throw new Error(
      'Invalid credentials',
    );
  }

  // GENERATE TOKEN
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};
