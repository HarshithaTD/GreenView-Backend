import mongoose, {
  Schema,
  Document,
  Model,
} from 'mongoose';

// =========================
// Register Interface
// =========================

export interface IRegister
  extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// Register Schema
// =========================

const RegisterSchema =
  new Schema<IRegister>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        default: '',
      },

      role: {
        type: String,
        enum: [
          'user',
          'admin',
        ],
        default: 'user',
      },
    },
    {
      timestamps: true,
    },
  );

// =========================
// Model Export
// =========================

const Register: Model<IRegister> =
  mongoose.model<IRegister>(
    'register',
    RegisterSchema,
  );

export default Register;