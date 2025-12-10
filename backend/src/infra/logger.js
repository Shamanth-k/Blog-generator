const { v4: uuidv4 } = require('uuid');
const { config } = require('./config');

/**
 * Log levels
 */
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[config.logLevel] || LOG_LEVELS.info;

/**
 * Create structured log entry
 * @param {string} level
 * @param {string} message
 * @param {Object} meta
 * @returns {Object}
 */
function createLogEntry(level, message, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
    service: 'blog-generator-backend',
    env: config.nodeEnv,
  };
}

/**
 * Logger with structured JSON output
 */
const logger = {
  debug(message, meta) {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log(JSON.stringify(createLogEntry('debug', message, meta)));
    }
  },

  info(message, meta) {
    if (currentLevel <= LOG_LEVELS.info) {
      console.log(JSON.stringify(createLogEntry('info', message, meta)));
    }
  },

  warn(message, meta) {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(JSON.stringify(createLogEntry('warn', message, meta)));
    }
  },

  error(message, meta) {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(JSON.stringify(createLogEntry('error', message, meta)));
    }
  },
};

/**
 * Generate trace ID for request tracking
 * @returns {string}
 */
function generateTraceId() {
  return uuidv4();
}

module.exports = { logger, generateTraceId };
