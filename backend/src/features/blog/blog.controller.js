const { Router } = require('express');
const { BlogService } = require('./blog.service');
const { logger } = require('../../infra/logger');

const router = Router();
const blogService = new BlogService();

/**
 * POST /api/v1/blog/generate
 * Generate a blog post from a prompt
 */
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const traceId = req.traceId;

  try {
    const result = await blogService.generateBlog(prompt, traceId);

    res.json({
      success: true,
      blog: result.blog,
      prompt: result.prompt,
      meta: result.meta,
    });
  } catch (error) {
    logger.warn('Blog generation failed', {
      traceId,
      code: error.code,
      message: error.message,
    });

    const status = error.status || 500;
    const code = error.code || 'INTERNAL_ERROR';

    res.status(status).json({
      success: false,
      error: error.message,
      code,
      requestId: traceId,
    });
  }
});

module.exports = { blogRouter: router };
