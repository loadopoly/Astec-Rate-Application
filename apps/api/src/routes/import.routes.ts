import { Router, Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { Request as ExpressRequest } from 'express';
import { importExcelFile } from '../services/excel.service';
import db from '../lib/db';

export const importRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req: ExpressRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream',
    ];
    const ext = file.originalname.toLowerCase();
    if (allowed.includes(file.mimetype) || ext.endsWith('.xlsx') || ext.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx / .xls) are accepted'));
    }
  },
});

/**
 * POST /api/v1/import/excel
 * Multipart form upload. Field name: "file"
 * Optional field: "importedBy" (string, defaults to "system")
 */
importRoutes.post('/excel', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    res.status(400).json({ error: 'Bad Request', message: 'No file uploaded — include an Excel file in the "file" field' });
    return;
  }

  try {
    const importedBy = (req.body?.importedBy as string) || 'system';
    const result = await importExcelFile(file.buffer, file.originalname, importedBy);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/import/logs
 * Returns the 50 most recent import logs.
 */
importRoutes.get('/logs', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await db.importLog.findMany({
      orderBy: { createdAt: 'desc' },
      take:    50,
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});
