import { Router, Request, Response, NextFunction } from 'express';
import db from '../lib/db';

export const lanesRoutes = Router();

// GET /api/v1/lanes
lanesRoutes.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const lanes = await db.lane.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        origin:      true,
        destination: true,
        metrics: {
          orderBy: { period: 'desc' },
          take:    12,
        },
      },
    });
    res.json(lanes);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/lanes/:id
lanesRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lane = await db.lane.findUnique({
      where: { id: req.params.id },
      include: {
        origin:      true,
        destination: true,
        metrics:     { orderBy: { period: 'desc' } },
        quotes: {
          orderBy: { quoteDate: 'desc' },
          take: 50,
          include: {
            selectedCarrier: { select: { id: true, name: true, mcNumber: true } },
          },
        },
      },
    });

    if (!lane) {
      res.status(404).json({ error: 'Not Found', message: `Lane "${req.params.id}" not found` });
      return;
    }
    res.json(lane);
  } catch (err) {
    next(err);
  }
});
