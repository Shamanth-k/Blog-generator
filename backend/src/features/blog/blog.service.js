const { BlogRepository } = require('./blog.repository');
const { logger } = require('../../infra/logger');

const PROMPT_MIN_LENGTH = 3;
const PROMPT_MAX_LENGTH = 500;

/**
 * Blog domain service - business logic layer
 */
class BlogService {
  constructor() {
    this.repository = new BlogRepository();
  }

  /**
   * Validate and generate blog from prompt
   * @param {string} prompt - Blog topic
   * @param {string} traceId - Request trace ID
   * @returns {Promise<{blog: string, prompt: string, meta: Object}>}
   */
  async generateBlog(prompt, traceId) {
    // Validate input
    const validation = this.validatePrompt(prompt);
    if (!validation.valid) {
      const error = new Error(validation.error);
      error.code = 'INVALID_PROMPT';
      error.status = 400;
      throw error;
    }

    const sanitizedPrompt = this.sanitizePrompt(prompt);

    logger.info('Generating blog', { traceId, promptLength: sanitizedPrompt.length });

    const startTime = Date.now();
    const result = await this.repository.generateContent(sanitizedPrompt, traceId);
    const duration = Date.now() - startTime;

    const wordCount = this.countWords(result.content);

    logger.info('Blog generated', {
      traceId,
      wordCount,
      durationMs: duration,
      model: result.model,
    });

    return {
      blog: result.content,
      prompt: sanitizedPrompt,
      meta: {
        wordCount,
        model: result.model,
        generatedAt: Date.now(),
      },
    };
  }

  /**
   * Validate prompt constraints
   * @param {string} prompt
   * @returns {{valid: boolean, error?: string}}
   */
  validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return { valid: false, error: 'Prompt is required and must be a string' };
    }

    const trimmed = prompt.trim();

    if (trimmed.length < PROMPT_MIN_LENGTH) {
      return {
        valid: false,
        error: `Prompt must be at least ${PROMPT_MIN_LENGTH} characters`,
      };
    }

    if (trimmed.length > PROMPT_MAX_LENGTH) {
      return {
        valid: false,
        error: `Prompt must not exceed ${PROMPT_MAX_LENGTH} characters`,
      };
    }

    return { valid: true };
  }

  /**
   * Sanitize prompt input
   * @param {string} prompt
   * @returns {string}
   */
  sanitizePrompt(prompt) {
    return prompt.trim().replace(/[\x00-\x1F\x7F]/g, '');
  }

  /**
   * Count words in text
   * @param {string} text
   * @returns {number}
   */
  countWords(text) {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }
}

module.exports = { BlogService };
