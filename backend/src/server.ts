import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import config from './config/config';

const app = express();

// Middleware
app.use(cors());  // Add CORS middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    console.log('Root route hit!');
    res.json({ message: 'Hello from Express!' });
});

app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Test endpoint working!' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

// MongoDB connection and server start
mongoose.connect(config.mongoUri)
    .then(() => {
        console.log('📦 Connected to MongoDB successfully');
        const PORT = config.port || 5050;
        app.listen(PORT, () => {
            console.log('=================================');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log('=================================');
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });