const axios = require('axios');
const { config } = require('../../infra/config');
const { logger } = require('../../infra/logger');

const HUGGINGFACE_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const MODEL_ID = 'Qwen/Qwen2.5-72B-Instruct';

/**
 * Blog generation data layer - handles external API communication
 */
class BlogRepository {
  /**
   * Generate blog content from prompt using AI model
   * @param {string} prompt - Blog topic
   * @param {string} traceId - Request trace ID
   * @returns {Promise<{content: string, model: string}>}
   * @throws {Error} API errors
   */
  async generateContent(prompt, traceId) {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(prompt);

    logger.debug('Calling HuggingFace API', { traceId, model: MODEL_ID });

    try {
      const response = await axios.post(
        HUGGINGFACE_API_URL,
        {
          model: MODEL_ID,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2000,
          temperature: 0.7,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${config.huggingfaceApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000,
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure from AI model');
      }

      return {
        content: response.data.choices[0].message.content,
        model: MODEL_ID,
      };
    } catch (error) {
      logger.error('HuggingFace API error', {
        traceId,
        error: error.message,
        status: error.response?.status,
      });

      if (error.response?.status === 503) {
        const apiError = new Error('Model is loading. Please try again in a few seconds.');
        apiError.code = 'MODEL_LOADING';
        apiError.status = 503;
        throw apiError;
      }

      if (error.response?.status === 429) {
        const apiError = new Error('API rate limit exceeded. Please try again later.');
        apiError.code = 'RATE_LIMITED';
        apiError.status = 429;
        throw apiError;
      }

      const apiError = new Error(
        error.response?.data?.error || 'Failed to generate blog content'
      );
      apiError.code = 'GENERATION_FAILED';
      apiError.status = error.response?.status || 500;
      throw apiError;
    }
  }

  buildSystemPrompt() {
    return `You are an expert blog writer. Write well-structured, engaging, and informative blog posts.
Always follow this structure:
- A catchy title (use # for the main title)
- An engaging introduction paragraph
- Clear headings and subheadings (use ## and ### for headings)
- Relevant examples and insights
- A compelling conclusion
- Use proper markdown formatting
- Target approximately 1000 words`;
  }

  buildUserPrompt(topic) {
    return `Write a comprehensive blog post on the following topic: ${topic}`;
  }
}

module.exports = { BlogRepository };
