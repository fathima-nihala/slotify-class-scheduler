import express from 'express';
import cors from 'cors';
import { config } from './config';
import batchesRouter from './routes/batches';
import bookingsRouter from './routes/bookings';
import authRouter from './routes/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRouter);
app.use('/api', batchesRouter);
app.use('/api', bookingsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
