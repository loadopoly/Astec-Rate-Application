import { Router, Request, Response, NextFunction } from 'express';
import db from '../lib/db';

export const quotesRoutes = Router();

// GET /api/v1/quotes
quotesRoutes.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const quotes = await db.quote.findMany({
      orderBy: { quoteDate: 'desc' },
      include: {
        lane: {
          include: {
            origin:      true,
            destination: true,
          },
        },
        selectedCarrier: { select: { id: true, name: true, mcNumber: true } },
        site:            { select: { id: true, name: true, code: true } },
      },
    });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/quotes/:id
quotesRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await db.quote.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { requestNumber: req.params.id },
        ],
      },
      include: {
        lane: {
          include: {
            origin:      true,
            destination: true,
          },
        },
        selectedCarrier: true,
        bids: {
          include: { carrier: true },
        },
        site:      true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!quote) {
      res.status(404).json({ error: 'Not Found', message: `Quote "${req.params.id}" not found` });
      return;
    }
    res.json(quote);
  } catch (err) {
    next(err);
  }
});
