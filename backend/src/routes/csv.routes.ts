import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Configure multer storage in memory
const storage = multer.memoryStorage();

// File size limit: 15MB
const limits = {
  fileSize: 15 * 1024 * 1024
};

// Filter to accept only CSV files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const isCsvMime = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.msexcel',
    'text/x-csv',
    'text/plain'
  ].includes(file.mimetype);

  const isCsvExt = file.originalname.toLowerCase().endsWith('.csv');

  if (isCsvMime || isCsvExt) {
    cb(null, true);
  } else {
    cb(new AppError('Only CSV files are allowed.', 400));
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter
}).single('file');

// POST /api/csv/upload
router.post('/upload', (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.file) {
        throw new AppError('No file uploaded. Please select a CSV file.', 400);
      }

      // Convert buffer to string
      let csvString = req.file.buffer.toString('utf8');

      // Strip UTF-8 BOM if present
      if (csvString.startsWith('\uFEFF')) {
        csvString = csvString.slice(1);
      }

      // Check if CSV is empty
      if (!csvString.trim()) {
        throw new AppError('The uploaded CSV file is empty.', 400);
      }

      // Parse CSV using papaparse
      const parseResult = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: false
      });

      // Handle parse errors
      if (parseResult.errors.length > 0) {
        // Log all errors for debugging
        console.warn('PapaParse warnings/errors:', parseResult.errors);
        
        // Check if there was a critical failure (e.g. no data successfully parsed)
        if (parseResult.data.length === 0) {
          throw new AppError('Malformed CSV. Unable to parse file.', 400);
        }
      }

      const rows = parseResult.data as Record<string, any>[];
      const headers = parseResult.meta.fields || [];

      // Check if we have no columns or no rows
      if (headers.length === 0 || rows.length === 0) {
        throw new AppError('The CSV file does not contain valid columns or data rows.', 400);
      }

      res.status(200).json({
        headers,
        rows,
        rowCount: rows.length
      });
    } catch (parseErr) {
      next(parseErr);
    }
  });
});

export default router;
