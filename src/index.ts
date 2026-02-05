import express from 'express';
import childrenRoutes from './routes/children.js';
import partiesRoutes from './routes/parties.js';
import classesRoutes from './routes/classes.js';
import careSessionsRoutes from './routes/careSessions.js';
import cors from 'cors';
import { rateLimiterBotDetector } from './middleware/security.js';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

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

app.all("/api/auth/*slat", toNodeHandler(auth));

// JSON middleware
app.use(express.json());

// Routes
app.use('/api/children', childrenRoutes);
app.use('/api/parties', partiesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/careSessions', careSessionsRoutes);

// Start server
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is running at ${url}`);
});
