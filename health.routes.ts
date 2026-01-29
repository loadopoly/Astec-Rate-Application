/**
 * Health Check Routes
 */

import { Router, Request, Response } from 'express';
// import { prisma } from '../config/database';
// import { redis } from '../config/redis';

const router = Router();

/**
 * Basic health check
 * GET /health
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Detailed health check (includes dependencies)
 * GET /health/detailed
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const health: Record<string, unknown> = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    dependencies: {
      database: 'NOT_CHECKED', // Will be implemented
      redis: 'NOT_CHECKED',    // Will be implemented
    },
  };

  // Check database connection
  // try {
  //   await prisma.$queryRaw`SELECT 1`;
  //   health.dependencies.database = 'OK';
  // } catch (error) {
  //   health.dependencies.database = 'ERROR';
  //   health.status = 'DEGRADED';
  // }

  // Check Redis connection
  // try {
  //   await redis.ping();
  //   health.dependencies.redis = 'OK';
  // } catch (error) {
  //   health.dependencies.redis = 'ERROR';
  //   health.status = 'DEGRADED';
  // }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe (for Kubernetes)
 * GET /health/ready
 */
router.get('/ready', async (req: Request, res: Response) => {
  // Check if all dependencies are available
  // const dbReady = await checkDatabase();
  // const redisReady = await checkRedis();
  
  // For now, always return ready
  res.json({ ready: true });
});

/**
 * Liveness probe (for Kubernetes)
 * GET /health/live
 */
router.get('/live', (req: Request, res: Response) => {
  res.json({ alive: true });
});

export { router as healthRoutes };
