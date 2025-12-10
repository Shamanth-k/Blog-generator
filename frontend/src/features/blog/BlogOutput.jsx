import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useShouldAnimate } from '../../design';
import { variants, transitions, getVariants, getTransition } from '../../design/motion';
import './BlogOutput.css';

/**
 * Count words in text
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * @param {{blog: string, prompt: string, meta?: {wordCount?: number, model?: string}, onReset: () => void}} props
 */
export function BlogOutput({ blog, prompt, meta, onReset }) {
  const shouldAnimate = useShouldAnimate();
  // Derive word count from content or use meta if available
  const wordCount = meta?.wordCount ?? countWords(blog);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blog);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = blog;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const fadeUpVariants = getVariants(variants.fadeUp, shouldAnimate);
  const fadeVariants = getVariants(variants.fade, shouldAnimate);
  const midTransition = getTransition(transitions.mid, shouldAnimate);

  return (
    <motion.article
      className="blog-output"
      aria-labelledby="blog-output-title"
      initial="initial"
      animate="animate"
      variants={fadeUpVariants}
      transition={midTransition}
    >
      <header className="blog-output__header">
        <h2 id="blog-output-title" className="blog-output__title">
          Your Generated Blog
        </h2>
        <div className="blog-output__actions">
          <motion.button
            type="button"
            className="blog-output__action"
            onClick={handleCopy}
            aria-label="Copy blog to clipboard"
            whileHover={shouldAnimate ? { scale: 1.02 } : {}}
            whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            transition={transitions.micro}
          >
            Copy
          </motion.button>
          <motion.button
            type="button"
            className="blog-output__action"
            onClick={onReset}
            aria-label="Create a new blog"
            whileHover={shouldAnimate ? { scale: 1.02 } : {}}
            whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            transition={transitions.micro}
          >
            New Blog
          </motion.button>
        </div>
      </header>

      <motion.div
        className="blog-output__content"
        initial="initial"
        animate="animate"
        variants={fadeVariants}
        transition={getTransition({ ...transitions.mid, delay: 0.1 }, shouldAnimate)}
      >
        <ReactMarkdown>{blog}</ReactMarkdown>
      </motion.div>

      <motion.footer
        className="blog-output__meta"
        initial="initial"
        animate="animate"
        variants={fadeVariants}
        transition={getTransition({ ...transitions.mid, delay: 0.2 }, shouldAnimate)}
      >
        <span className="blog-output__meta-topic">
          Topic: <strong>{prompt}</strong>
        </span>
        <span className="blog-output__word-count" aria-label={`${wordCount} words`}>
          {wordCount} words
        </span>
      </motion.footer>
    </motion.article>
  );
}
