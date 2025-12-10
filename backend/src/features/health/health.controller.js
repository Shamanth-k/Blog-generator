const { Router } = require('express');
const axios = require('axios');
const { config } = require('../../infra/config');
const { logger } = require('../../infra/logger');

const router = Router();
const startTime = Date.now();

/**
 * GET /health
 * Health check endpoint - always responds if server is running
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: 'v1',
    uptime: Math.floor((Date.now() - startTime) / 1000),
  });
});

/**
 * GET /ready
 * Readiness check - verifies external dependencies
 */
router.get('/ready', async (req, res) => {
  const checks = {
    api: false,
  };

  try {
    // Check HuggingFace API connectivity
    const response = await axios.get('https://router.huggingface.co/v1/models', {
      headers: {
        Authorization: `Bearer ${config.huggingfaceApiKey}`,
      },
      timeout: 5000,
    });
    checks.api = response.status === 200;
  } catch (error) {
    logger.warn('Readiness check failed', {
      traceId: req.traceId,
      check: 'api',
      error: error.message,
    });
  }

  const ready = Object.values(checks).every(Boolean);

  res.status(ready ? 200 : 503).json({
    ready,
    checks,
    timestamp: new Date().toISOString(),
  });
});

module.exports = { healthRouter: router };
