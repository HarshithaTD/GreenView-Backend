import express, {
  Request,
  Response,
  NextFunction,
} from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';

// ROUTES
import cartRoutes from './routes/cartRoutes';
import authRoutes from './routes/authRoutes';
import plotRoutes from './routes/plotRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';

// CONTROLLER
import { getDashboardStats } from './controllers/dashboardController';

dotenv.config();

const app = express();

// ================= MIDDLEWARES =================
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// ================= STATIC FOLDER =================
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads'),
  ),
);

// ================= ROUTES =================
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/booking', bookingRoutes);

app.get('/api/dashboard/stats', getDashboardStats);

// ================= TEST ROUTE =================
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'GreenView API running',
  });
});

// ================= 404 HANDLER =================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  });
});

export default app;