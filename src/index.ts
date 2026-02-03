import express from 'express';
import childrenRoutes from './routes/children';
import staffRoutes from './routes/staff';
import cors from 'cors';
import { rateLimiterBotDetector } from './middleware/security';

const app = express();
const PORT = 3001;

if (!process.env.FRONTEND_URL) {
  console.warn('FRONTEND_URL is not defined, CORS may not work as expected');
}

// Rate limiter middleware
app.use(rateLimiterBotDetector);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON middleware
app.use(express.json());

// Routes
app.use('/api/children', childrenRoutes);
app.use('/api/staff', staffRoutes);

// Start server
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is running at ${url}`);
});
