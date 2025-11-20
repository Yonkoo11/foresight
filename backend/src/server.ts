import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { testConnection } from './utils/db';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { initializeWebSocket, getConnectedClientsCount } from './services/websocket';
import { initializeCronJobs, getCronJobsStatus } from './services/cronJobs';

// Import routes
import authRoutes from './api/auth';
import userRoutes from './api/users';
import draftRoutes from './api/draft';
import arenaRoutes from './api/arena';
import gauntletRoutes from './api/gauntlet';
import whispererRoutes from './api/whisperer';
import questRoutes from './api/quests';
import adminRoutes from './api/admin';

// Create Express app and HTTP server
const app: Application = express();
const httpServer = createServer(app);

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Allow configured frontend URL or localhost on any port in development
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
    ].filter(Boolean);

    // In development, also allow any localhost port
    if (NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined')); // Logging

// Rate limiting (apply to all routes)
app.use(apiLimiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Timecaster API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      draft: '/api/draft',
      arena: '/api/arena',
      gauntlet: '/api/gauntlet',
      whisperer: '/api/whisperer',
      quests: '/api/quests',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    websocket: {
      connected: getConnectedClientsCount(),
    },
  });
});

// Cron jobs status endpoint
app.get('/api/admin/cron-status', (req, res) => {
  res.json({
    jobs: getCronJobsStatus(),
  });
});

// Manual scoring trigger (for testing)
app.post('/api/admin/run-scoring', async (req, res) => {
  try {
    const { runDraftScoringCycle } = await import('./services/draftScoring');
    await runDraftScoringCycle();
    res.json({
      success: true,
      message: 'Scoring cycle completed successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/draft', draftRoutes);
app.use('/api/arena', arenaRoutes);
app.use('/api/gauntlet', gauntletRoutes);
app.use('/api/whisperer', whispererRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

/**
 * Start server
 */
export async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Initialize WebSocket
    initializeWebSocket(httpServer);

    // Initialize cron jobs
    initializeCronJobs();

    // Start listening
    httpServer.listen(PORT, () => {
      console.log('========================================');
      console.log('CT league Backend');
      console.log('========================================');
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
