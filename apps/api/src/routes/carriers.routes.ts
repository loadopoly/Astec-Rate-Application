import { Router, Request, Response, NextFunction } from 'express';
import db from '../lib/db';

export const carriersRoutes = Router();

// GET /api/v1/carriers
carriersRoutes.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const carriers = await db.carrier.findMany({
      where:   { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        contacts:    true,
        performance: { orderBy: { period: 'desc' }, take: 12 },
      },
    });
    res.json(carriers);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/carriers/:mc  — look up by MC number or internal id
carriersRoutes.get('/:mc', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const carrier = await db.carrier.findFirst({
      where: {
        OR: [
          { id:       req.params.mc },
          { mcNumber: req.params.mc },
        ],
      },
      include: {
        contacts:    true,
        performance: { orderBy: { period: 'desc' }, take: 24 },
        sites:       { include: { site: true } },
        bids: {
          include: { quote: { include: { lane: { include: { origin: true, destination: true } } } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!carrier) {
      res.status(404).json({ error: 'Not Found', message: `Carrier "${req.params.mc}" not found` });
      return;
    }
    res.json(carrier);
  } catch (err) {
    next(err);
  }
});
