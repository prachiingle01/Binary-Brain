import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { setupWebSocket } from './services/websocket';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

// API Prefix
app.use('/api', apiRoutes);

export const server = http.createServer(app);

// Setup WebSocket server attached to HTTP server
setupWebSocket(server);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🤖 Binary-Brain Backend Server running on port ${PORT}`);
    console.log(`📡 WebSocket server initialized`);
    console.log(`⚡ API Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}
