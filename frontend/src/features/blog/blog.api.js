const API_BASE = 'http://localhost:5000';
const API_VERSION = 'v1';

/**
 * API client for blog generation
 * Handles all HTTP communication with backend
 */

/**
 * Generate blog from prompt
 * @param {string} prompt - Blog topic (3-500 characters)
 * @returns {Promise<{success: boolean, blog: string, prompt: string, meta: Object}>}
 * @throws {Error} Network or API errors with descriptive messages
 */
export async function generateBlog(prompt) {
  // Input validation at boundary
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt provided');
  }

  const trimmedPrompt = prompt.trim();
  if (trimmedPrompt.length < 3) {
    throw new Error('Prompt must be at least 3 characters');
  }
  if (trimmedPrompt.length > 500) {
    throw new Error('Prompt must not exceed 500 characters');
  }

  const response = await fetch(`${API_BASE}/api/${API_VERSION}/blog/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: trimmedPrompt }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Surface error with request ID for debugging
    const errorMessage = data.error || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.code = data.code;
    error.requestId = data.requestId;
    throw error;
  }

  // Validate response structure
  if (!data.success || typeof data.blog !== 'string') {
    throw new Error('Invalid response from server');
  }

  return data;
}
