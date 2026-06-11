import RegisterModel, {
  IRegister,
} from '../models/RegisterModel';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ============================
// Interfaces
// ============================

interface AuthBody {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'admin';
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
  };
}

// ============================
// REGISTER SERVICE
// ============================

export const registerService =
  async (
    body: AuthBody,
  ): Promise<AuthResponse> => {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = body;

    if (
      !name ||
      !email ||
      !password
    ) {
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
      await bcrypt.hash(
        password,
        10,
      );

    // CREATE USER
    const user: IRegister =
      await RegisterModel.create({
        name,
        email: normalizedEmail,
        password:
          hashedPassword,
        phone,
        role: role || 'user',
      });

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      },
    );

    return {
      token,
      user: {
        id: String(user._id),
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

export const loginService =
  async (
    body: AuthBody,
  ): Promise<AuthResponse> => {
    const {
      email,
      password,
    } = body;

    if (
      !email ||
      !password
    ) {
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
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      },
    );

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  };