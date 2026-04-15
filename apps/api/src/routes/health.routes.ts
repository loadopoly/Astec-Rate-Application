import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/detailed', async (_req: Request, res: Response) => {
  const health: Record<string, unknown> = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    dependencies: {
      database: 'NOT_CHECKED',
      redis: 'NOT_CHECKED',
    },
  };

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});

router.get('/ready', (_req: Request, res: Response) => {
  res.json({ ready: true });
});

router.get('/live', (_req: Request, res: Response) => {
  res.json({ alive: true });
});

export { router as healthRoutes };
