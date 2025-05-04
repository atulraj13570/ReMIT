import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import userRoutes from './routes/user.js';
import postsRoutes from './routes/posts.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Log environment variables for debugging (remove in production)
console.log('Environment variables loaded:', {
  MONGO_URI: process.env.MONGO_URI ? 'Set (value hidden)' : 'Not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set (value hidden)' : 'Not set',
  PORT: process.env.PORT || 5000
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Default MongoDB connection if environment variable is not set
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carrier-portal';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Attempted to connect to:', MONGO_URI);
  });

app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);

app.get('/', (req, res) => {
  res.send('Carrier Portal API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
