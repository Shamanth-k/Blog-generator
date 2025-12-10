/**
 * Shared Data Transfer Objects (DTOs)
 * These define the contract between frontend and backend
 */

/**
 * @typedef {Object} BlogGenerateRequest
 * @property {string} prompt - The blog topic (3-500 characters)
 */

/**
 * @typedef {Object} BlogGenerateResponse
 * @property {boolean} success - Whether generation succeeded
 * @property {string} blog - The generated blog content (markdown)
 * @property {string} prompt - The original prompt
 * @property {Object} meta - Metadata about the generation
 * @property {number} meta.wordCount - Number of words in the blog
 * @property {string} meta.model - Model used for generation
 * @property {number} meta.generatedAt - Unix timestamp
 */

/**
 * @typedef {Object} ApiError
 * @property {boolean} success - Always false for errors
 * @property {string} error - Human-readable error message
 * @property {string} code - Machine-readable error code
 * @property {string} [requestId] - Request trace ID
 */

/**
 * @typedef {Object} HealthResponse
 * @property {string} status - 'healthy' | 'unhealthy'
 * @property {string} timestamp - ISO timestamp
 * @property {string} version - API version
 */

/**
 * @typedef {Object} ReadinessResponse
 * @property {boolean} ready - Whether service is ready
 * @property {Object} checks - Individual check results
 * @property {boolean} checks.api - API connectivity
 */

// Export empty object for CommonJS compatibility
module.exports = {};
