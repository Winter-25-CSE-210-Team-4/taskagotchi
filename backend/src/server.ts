// src/server.ts
import express from 'express';

// 创建 Express 应用
const app = express();

// 简单路由
app.get('/', (req, res) => {
    console.log('Root route hit!'); // 添加日志
    res.json({ message: 'Hello from Express!' });
});

app.get('/test', (req, res) => {
    console.log('Test route hit!'); // 添加日志
    res.json({ message: 'Test endpoint working!' });
});

// 启动服务器
const PORT = 5050;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log('=================================');
});