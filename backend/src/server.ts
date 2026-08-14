import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { initWebSocketServer } from './services/websocket';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Centralized Error Handling
app.use(errorHandler);

// HTTP & Socket.IO Server Initialization
const server = http.createServer(app);
const io = initWebSocketServer(server);

// Only listen if not imported by test suite
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Binary-Brain Backend API & WebSocket Server live on port ${PORT}`);
    console.log(`📡 WebSocket endpoint ready for bi-directional live stream.`);
  });
}

export { app, server, io };
