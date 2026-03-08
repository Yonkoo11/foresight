import express, { Application } from 'express';
import { createServer } from 'http';
import dns from 'dns';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { testConnection } from './utils/db';
import { apiLimiter } from './middleware/rateLimiter';
import { csrfProtection } from './middleware/csrf';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { initializeCronJobs } from './services/cronJobs';
import { ensureDemoContest } from './api/admin';
import logger from './utils/logger';

// Import routes
import authRoutes from './api/auth';
import userRoutes from './api/users';
import adminRoutes from './api/admin';
import leagueRoutes from './api/league';
import privateLeaguesRoutes from './api/privateLeagues';
import achievementsRoutes from './api/achievements';
import errorsRoutes from './api/errors';
import referralsRoutes from './api/referrals';
import prizedContestsV2Routes from './api/prizedContestsV2';
import foresightScoreRoutes from './api/foresightScore';
import questsRoutes from './api/quests';
import activityRoutes from './api/activity';
import ctFeedRoutes from './api/ctFeed';
import watchlistRoutes from './api/watchlist';
import intelRoutes from './api/intel';
import twitterRoutes from './api/twitter';
import tapestryRoutes from './api/tapestry';

// Create Express app and HTTP server
const app: Application = express();
const httpServer = createServer(app);

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
// FINDING-020: Configure Helmet with explicit CSP
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.devnet.solana.com', 'https://*.privy.io'],
      frameSrc: ["'self'", 'https://*.privy.io'],
      formAction: ["'self'"],
    },
  } : false, // Disable CSP in development for easier debugging
  hsts: NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
}));

// FINDING-013: Enforce HTTPS in production
// Skip /health so Railway's internal healthcheck (plain HTTP, no proxy headers) passes
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.path === '/health') return next();
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Allow configured frontend URL(s) or localhost on any port in development
    const extraOrigins = process.env.CORS_EXTRA_ORIGINS
      ? process.env.CORS_EXTRA_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
      : [];
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      ...extraOrigins,
      'http://localhost:5173',
      'http://localhost:5174',
    ].filter(Boolean);

    // In development, also allow any localhost port
    if (NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    // Allow ngrok URLs for sharing (development only — FINDING-012)
    if (NODE_ENV === 'development' && origin.includes('.ngrok-free.app')) {
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
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined')); // Logging

// CSRF protection for state-changing requests (FINDING-021)
app.use(csrfProtection);

// Rate limiting (apply to all routes)
app.use(apiLimiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CT Fantasy League API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      league: '/api/league',
      privateLeagues: '/api/private-leagues',
      admin: '/api/admin',
      errors: '/api/errors',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Image proxy for canvas CORS — allows frontend to draw external images
// SECURITY: Whitelist + private IP blocking to prevent SSRF (FINDING-003)
const PROXY_ALLOWED_DOMAINS = [
  'pbs.twimg.com',
  'abs.twimg.com',
  'platform-lookaside.fbsbx.com',
  'avatars.githubusercontent.com',
  'cdn.stamp.fyi',
  'arweave.net',
  'i.imgur.com',
];

/**
 * Check if an IP address falls within private/reserved ranges.
 * Uses numeric comparison for correct CIDR matching (fixes 172.16.0.0/12).
 */
function isPrivateIP(ip: string): boolean {
  // IPv6 loopback
  if (ip === '::1') return true;

  // Parse IPv4
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return true; // Non-IPv4 addresses treated as private (block by default)
  }

  const [a, b] = parts;

  return (
    a === 0 ||                           // 0.0.0.0/8
    a === 10 ||                          // 10.0.0.0/8
    a === 127 ||                         // 127.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
    (a === 192 && b === 168) ||          // 192.168.0.0/16
    (a === 169 && b === 254)             // 169.254.0.0/16 (link-local)
  );
}

app.get('/api/proxy-image', async (req, res) => {
  const urlParam = req.query.url as string;
  if (!urlParam) return res.status(400).send('Missing url param');

  let parsed: URL;
  try {
    parsed = new URL(urlParam);
  } catch {
    return res.status(400).send('Invalid URL');
  }

  // Block non-HTTP(S) schemes
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return res.status(403).send('Only HTTP(S) URLs allowed');
  }

  // Block hostnames that look private (localhost, .internal, .local)
  const hostname = parsed.hostname;
  if (hostname === 'localhost' || hostname.endsWith('.internal') || hostname.endsWith('.local')) {
    return res.status(403).send('Access denied');
  }

  // Whitelist domains
  if (!PROXY_ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d))) {
    return res.status(403).send('Domain not allowed');
  }

  // DNS resolution check: resolve hostname to IP and validate against private ranges
  // This blocks DNS rebinding attacks where a public domain resolves to 127.0.0.1
  let resolvedIP: string;
  try {
    const { address } = await dns.promises.lookup(hostname);
    resolvedIP = address;
  } catch {
    return res.status(502).send('DNS resolution failed');
  }

  if (isPrivateIP(resolvedIP)) {
    return res.status(403).send('Access denied');
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(parsed.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return res.status(response.status).send('Upstream error');

    // Validate content type is an image
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return res.status(403).send('Only image content allowed');
    }

    // Reject responses over 10MB
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
    if (contentLength > 10 * 1024 * 1024) {
      return res.status(413).send('Image too large');
    }

    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    });
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch {
    res.status(502).send('Failed to fetch image');
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/league', leagueRoutes);
app.use('/api/private-leagues', privateLeaguesRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/errors', errorsRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/v2', prizedContestsV2Routes);
app.use('/api/v2/fs', foresightScoreRoutes);
app.use('/api/v2/quests', questsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/ct-feed', ctFeedRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/intel', intelRoutes);
app.use('/api/twitter', twitterRoutes);
app.use('/api/tapestry', tapestryRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

/**
 * Validate critical API keys at startup — warn but don't crash
 */
function validateApiKeys(): void {
  const keys = [
    { name: 'PRIVY_APP_ID', required: true, desc: 'Privy auth (login will fail)' },
    { name: 'PRIVY_APP_SECRET', required: true, desc: 'Privy auth (login will fail)' },
    { name: 'JWT_SECRET', required: true, desc: 'Session tokens (already checked)' },
    { name: 'TAPESTRY_API_KEY', required: false, desc: 'Tapestry social layer (scores won\'t store on-chain)' },
    { name: 'TWITTER_API_IO_KEY', required: false, desc: 'Twitter data pipeline (CT Feed won\'t refresh)' },
    { name: 'DATABASE_URL', required: true, desc: 'PostgreSQL (server won\'t start)' },
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of keys) {
    if (!process.env[key.name]) {
      if (key.required) {
        missing.push(`  ❌ ${key.name} — ${key.desc}`);
      } else {
        warnings.push(`  ⚠️  ${key.name} — ${key.desc}`);
      }
    }
  }

  if (missing.length > 0 || warnings.length > 0) {
    logger.info('');
    logger.info('┌─ API Key Validation ─────────────────────┐');
    if (missing.length > 0) {
      logger.error('│ MISSING (required):');
      missing.forEach(m => logger.error(m));
    }
    if (warnings.length > 0) {
      logger.warn('│ MISSING (optional):');
      warnings.forEach(w => logger.warn(w));
    }
    logger.info('└──────────────────────────────────────────┘');
    logger.info('');
  }
}

/**
 * Start server
 */
export async function startServer() {
  try {
    // Validate API keys
    validateApiKeys();

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Initialize Cron Jobs for automated scoring
    initializeCronJobs();

    // Ensure a demo contest exists (self-healing — runs on every startup)
    ensureDemoContest()
      .then(({ created }) => {
        if (created) {
          logger.info('✅ Demo contest auto-created on startup');
        } else {
          logger.info('✅ Demo contest already active');
        }
      })
      .catch((err) => {
        // Log but don't crash the server — contest creation is non-critical at boot
        logger.warn('⚠️  Demo contest auto-seed failed (will retry on next startup):', err.message);
      });

    // Start listening
    httpServer.listen(PORT, () => {
      logger.info('========================================');
      logger.info('CT league Backend');
      logger.info('========================================');
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info('========================================');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
