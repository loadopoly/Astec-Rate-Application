/**
 * IPS Freight Platform - API Server
 * 
 * Main entry point for the Express.js API server.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import { healthRoutes } from './routes/health.routes';
// import { authRoutes } from './routes/auth.routes';
// import { quotesRoutes } from './routes/quotes.routes';
// import { lanesRoutes } from './routes/lanes.routes';
// import { carriersRoutes } from './routes/carriers.routes';
// import { bidsRoutes } from './routes/bids.routes';
// import { analyticsRoutes } from './routes/analytics.routes';

const app: Express = express();

// ===========================================
// MIDDLEWARE
// ===========================================

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

// Request logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
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

// ===========================================
// ROUTES
// ===========================================

// Health check (no auth required)
app.use('/health', healthRoutes);

// API routes (v1)
const apiRouter = express.Router();

// Public routes
// apiRouter.use('/auth', authRoutes);

// Protected routes (add auth middleware)
// apiRouter.use('/quotes', quotesRoutes);
// apiRouter.use('/lanes', lanesRoutes);
// apiRouter.use('/carriers', carriersRoutes);
// apiRouter.use('/bids', bidsRoutes);
// apiRouter.use('/analytics', analyticsRoutes);

// Placeholder until routes are implemented
apiRouter.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'IPS Freight Platform API',
    version: '0.1.0',
    status: 'OK',
    documentation: '/api/docs',
  });
});

app.use('/api/v1', apiRouter);

// API docs (Swagger - future)
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use(errorHandler);

// ===========================================
// SERVER STARTUP
// ===========================================

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 IPS Freight API Server running on port ${PORT}`);
  logger.info(`   Environment: ${config.nodeEnv}`);
  logger.info(`   Health check: http://localhost:${PORT}/health`);
  logger.info(`   API base: http://localhost:${PORT}/api/v1`);
});

export default app;
