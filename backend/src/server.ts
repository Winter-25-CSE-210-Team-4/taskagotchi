import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskagotchi';

// 连接 MongoDB（新版 Mongoose 不需要额外选项）
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

const app = express();

app.get('/', (req, res) => {
    console.log('Root route hit!');
    res.json({ message: 'Hello from Express!' });
});

app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Test endpoint working!' });
});


app.use(express.json());
app.use("/api/tasks", taskRoutes);



const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log('=================================');
});
