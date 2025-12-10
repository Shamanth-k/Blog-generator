const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { config } = require('../infra/config');
const { logger, generateTraceId } = require('../infra/logger');

/**
 * Security middleware using Helmet
 */
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * CORS middleware
 */
const corsMiddleware = cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
});

/**
 * Rate limiting middleware
 */
const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Request tracing middleware - attaches trace ID to each request
 */
function tracingMiddleware(req, res, next) {
  req.traceId = req.headers['x-trace-id'] || generateTraceId();
  res.setHeader('x-trace-id', req.traceId);
  next();
}

/**
 * Request logging middleware
 */
function requestLoggerMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      traceId: req.traceId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      userAgent: req.headers['user-agent'],
    });
  });

  next();
}

/**
 * Global error handler middleware
 */
function errorHandlerMiddleware(err, req, res, next) {
  logger.error('Unhandled error', {
    traceId: req.traceId,
    error: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    requestId: req.traceId,
  });
}

/**
 * 404 handler
 */
function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    requestId: req.traceId,
  });
}

module.exports = {
  securityMiddleware,
  corsMiddleware,
  rateLimitMiddleware,
  tracingMiddleware,
  requestLoggerMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
};
