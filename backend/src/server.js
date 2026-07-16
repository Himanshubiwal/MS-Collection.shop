import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware: Helmet headers with cross-origin allowance for public uploaded images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Rate Limiting: Prevent DDoS and API brute-forcing
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Resilient CORS setup for Render + Vercel (allowing production and preview subdomains)
const getAllowedOrigins = () => {
  const defaults = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
  if (process.env.CLIENT_URL) {
    return [...defaults, ...process.env.CLIENT_URL.split(',').map(u => u.trim().replace(/\/$/, ''))];
  }
  return defaults;
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const allowed = getAllowedOrigins();
    if (
      allowed.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.endsWith('.onrender.com') ||
      process.env.CLIENT_URL === '*' ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true,
}));

// Capture raw body for Razorpay webhook signature verification while parsing JSON
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded media files for free local storage
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/lookbook', categoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Operational',
    timestamp: new Date().toISOString(),
    store: 'MS Collection API (Sikar, Rajasthan)',
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.send('MS Collection Fashion Store API (Sikar, Rajasthan, India) is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[MS Collection API Server]: Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
