import { useState } from 'react';
import { motion } from 'framer-motion';
import { useShouldAnimate } from '../../design';
import { variants, transitions, getVariants, getTransition, staggerContainer } from '../../design/motion';
import './BlogInput.css';

const SAMPLE_PROMPTS = [
  'The Future of Artificial Intelligence',
  'Sustainable Living Tips',
  'Remote Work Best Practices',
  'Mental Health Awareness',
  'Space Exploration in 2024',
];

/**
 * @param {{onSubmit: (prompt: string) => void, isLoading: boolean}} props
 */
export function BlogInput({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const shouldAnimate = useShouldAnimate();

  const canSubmit = prompt.trim().length > 0 && !isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(prompt.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && canSubmit) {
      onSubmit(prompt.trim());
    }
  };

  const fadeUpVariants = getVariants(variants.fadeUp, shouldAnimate);
  const midTransition = getTransition(transitions.mid, shouldAnimate);
  const containerVariants = shouldAnimate ? staggerContainer : {};

  return (
    <motion.section
      className="blog-input"
      aria-labelledby="blog-input-title"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUpVariants}
      transition={midTransition}
    >
      <h2 id="blog-input-title" className="blog-input__title">
        Write Your Prompt
      </h2>
      <p className="blog-input__subtitle">
        Describe your blog topic and let AI do the rest
      </p>

      <form onSubmit={handleSubmit} className="blog-input__form">
        <label htmlFor="prompt-textarea" className="visually-hidden">
          Blog topic or idea
        </label>
        <textarea
          id="prompt-textarea"
          className="blog-input__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your blog topic or idea here... (e.g., 'The Benefits of Morning Meditation')"
          disabled={isLoading}
          aria-describedby="char-count"
        />

        <div id="char-count" className="blog-input__char-count" aria-live="polite">
          {prompt.length} characters
        </div>

        <motion.button
          type="submit"
          className="blog-input__submit"
          disabled={!canSubmit}
          aria-busy={isLoading}
          whileHover={shouldAnimate ? { scale: 1.02 } : {}}
          whileTap={shouldAnimate ? { scale: 0.98 } : {}}
          transition={transitions.micro}
        >
          {isLoading ? (
            <>
              <span className="blog-input__spinner" aria-hidden="true" />
              Generating...
            </>
          ) : (
            <>
              <span aria-hidden="true">🚀</span> Generate Blog
            </>
          )}
        </motion.button>
      </form>

      <motion.div
        className="blog-input__suggestions"
        role="group"
        aria-label="Suggested topics"
        initial="initial"
        animate="animate"
        variants={containerVariants}
      >
        <span className="blog-input__suggestion-label">Try:</span>
        {SAMPLE_PROMPTS.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            type="button"
            className="blog-input__suggestion"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            variants={fadeUpVariants}
            transition={getTransition({ ...transitions.micro, delay: index * 0.05 }, shouldAnimate)}
            whileHover={shouldAnimate ? { scale: 1.05 } : {}}
            whileTap={shouldAnimate ? { scale: 0.95 } : {}}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
}
