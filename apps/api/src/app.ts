import path from 'path';
import fs from 'fs';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthRoutes } from './routes/health.routes';

// When the frontend is built alongside the API (production / Docker combined mode),
// serve it as static files from the same process so no separate web server is needed.
const webDistPath = path.join(__dirname, '../../web/dist');
const webDistExists = fs.existsSync(path.join(webDistPath, 'index.html'));

const app: Express = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Serve React frontend static assets (JS, CSS, images) when built together
if (webDistExists) {
  app.use(express.static(webDistPath, { index: false }));
}

// Request logging
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Health check
app.use('/health', healthRoutes);

// API routes
const apiRouter = express.Router();

apiRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'IPS Freight Platform API',
    version: '0.1.1',
    status: 'OK',
  });
});

app.use('/api/v1', apiRouter);

// 404 handler — for non-API routes, serve the React SPA (react-router handles the page);
// for unknown API / health routes, return JSON 404.
app.use((req: Request, res: Response) => {
  if (webDistExists && !req.path.startsWith('/api') && req.path !== '/health') {
    res.sendFile(path.join(webDistPath, 'index.html'));
    return;
  }
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 IPS Freight API Server running on port ${PORT}`);
  logger.info(`   Environment: ${config.nodeEnv}`);
  logger.info(`   Health check: http://localhost:${PORT}/health`);
  logger.info(`   API base: http://localhost:${PORT}/api/v1`);
});

export default app;
