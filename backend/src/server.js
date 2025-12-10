const express = require('express');
const { config, logger } = require('./infra');
const {
  securityMiddleware,
  corsMiddleware,
  rateLimitMiddleware,
  tracingMiddleware,
  requestLoggerMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
} = require('./middleware');
const { blogRouter } = require('./features/blog');
const { healthRouter } = require('./features/health');

const app = express();

// Security middleware
app.use(securityMiddleware);
app.use(corsMiddleware);

// Request parsing
app.use(express.json({ limit: '10kb' }));

// Tracing and logging
app.use(tracingMiddleware);
app.use(requestLoggerMiddleware);

// Health endpoints (no rate limiting)
app.use(healthRouter);

// Rate limiting for API routes
app.use('/api', rateLimitMiddleware);

// API routes
app.use('/api/v1/blog', blogRouter);

// Error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start server
const server = app.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    env: config.nodeEnv,
    corsOrigin: config.corsOrigin,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = { app };
