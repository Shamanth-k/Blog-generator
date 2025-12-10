const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Configuration schema with validation
 */
const configSchema = {
  port: {
    env: 'PORT',
    default: 5000,
    transform: Number,
    validate: (v) => v > 0 && v < 65536,
  },
  nodeEnv: {
    env: 'NODE_ENV',
    default: 'development',
    validate: (v) => ['development', 'production', 'test'].includes(v),
  },
  huggingfaceApiKey: {
    env: 'HUGGINGFACE_API_KEY',
    required: true,
    validate: (v) => typeof v === 'string' && v.length > 0,
  },
  corsOrigin: {
    env: 'CORS_ORIGIN',
    default: 'http://localhost:3000',
  },
  rateLimitWindowMs: {
    env: 'RATE_LIMIT_WINDOW_MS',
    default: 60000,
    transform: Number,
  },
  rateLimitMax: {
    env: 'RATE_LIMIT_MAX',
    default: 10,
    transform: Number,
  },
  logLevel: {
    env: 'LOG_LEVEL',
    default: 'info',
    validate: (v) => ['debug', 'info', 'warn', 'error'].includes(v),
  },
};

/**
 * Load and validate configuration at startup
 * @returns {Object} Validated configuration
 * @throws {Error} If required config is missing or invalid
 */
function loadConfig() {
  const config = {};
  const errors = [];

  for (const [key, schema] of Object.entries(configSchema)) {
    let value = process.env[schema.env];

    // Apply default if not set
    if (value === undefined && schema.default !== undefined) {
      value = schema.default;
    }

    // Check required
    if (value === undefined && schema.required) {
      errors.push(`Missing required environment variable: ${schema.env}`);
      continue;
    }

    // Transform value
    if (value !== undefined && schema.transform) {
      value = schema.transform(value);
    }

    // Validate
    if (value !== undefined && schema.validate && !schema.validate(value)) {
      errors.push(`Invalid value for ${schema.env}: ${value}`);
      continue;
    }

    config[key] = value;
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }

  return Object.freeze(config);
}

// Validate config at module load time
const config = loadConfig();

module.exports = { config };
