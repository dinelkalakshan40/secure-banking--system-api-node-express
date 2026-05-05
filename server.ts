import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './src/middlewares/errorHandler.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import accountRoutes from './src/routes/accountRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus_bank';
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
   
  }
};

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Nexus Bank API is healthy', timestamp: new Date() });
});

// Root route with info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Nexus Bank API',
    version: '1.0.0',
    docs: 'Refer to README.md for sample requests'
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
