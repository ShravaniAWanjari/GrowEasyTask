import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health.routes';
import csvRouter from './routes/csv.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Global Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', healthRouter);
app.use('/api/csv', csvRouter);

// Error Handler
app.use(errorHandler);

export default app;
