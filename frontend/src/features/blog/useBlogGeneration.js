import { useState, useCallback } from 'react';
import { generateBlog } from './blog.api';

/**
 * @typedef {'idle' | 'loading' | 'success' | 'error'} BlogStatus
 * @typedef {{status: BlogStatus, blog: string | null, prompt: string | null, meta: Object | null, error: string | null}} BlogState
 */

const INITIAL_STATE = {
  status: 'idle',
  blog: null,
  prompt: null,
  meta: null,
  error: null,
};

/**
 * Hook for blog generation with proper state management
 * @returns {{state: BlogState, generate: (prompt: string) => Promise<void>, reset: () => void}}
 */
export function useBlogGeneration() {
  const [state, setState] = useState(INITIAL_STATE);

  const generate = useCallback(async (prompt) => {
    setState({ status: 'loading', blog: null, prompt: null, meta: null, error: null });

    try {
      const result = await generateBlog(prompt);
      setState({
        status: 'success',
        blog: result.blog,
        prompt: result.prompt,
        meta: result.meta || null,
        error: null,
      });
    } catch (err) {
      setState({
        status: 'error',
        blog: null,
        prompt: null,
        meta: null,
        error: err.message || 'An unexpected error occurred',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { state, generate, reset };
}
