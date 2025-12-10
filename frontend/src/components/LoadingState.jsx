import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import { variants, transitions, getVariants, getTransition } from '../design/motion';
import './LoadingState.css';

/**
 * @param {{message?: string}} props
 */
export function LoadingState({ message = 'Loading...' }) {
  const shouldAnimate = useShouldAnimate();

  const fadeScaleVariants = getVariants(variants.fadeScale, shouldAnimate);
  const fadeVariants = getVariants(variants.fade, shouldAnimate);
  const midTransition = getTransition(transitions.mid, shouldAnimate);

  return (
    <motion.div
      className="loading-state"
      role="status"
      aria-live="polite"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeScaleVariants}
      transition={midTransition}
    >
      <motion.div
        className="loading-state__spinner"
        aria-hidden="true"
        animate={shouldAnimate ? { rotate: 360 } : {}}
        transition={shouldAnimate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      />
      <motion.p
        className="loading-state__message"
        initial="initial"
        animate="animate"
        variants={fadeVariants}
        transition={getTransition({ ...transitions.mid, delay: 0.1 }, shouldAnimate)}
      >
        {message}
      </motion.p>
      <motion.p
        className="loading-state__tip"
        initial="initial"
        animate="animate"
        variants={fadeVariants}
        transition={getTransition({ ...transitions.mid, delay: 0.2 }, shouldAnimate)}
      >
        This may take up to a minute. The AI is crafting a comprehensive ~1000 word article.
      </motion.p>
    </motion.div>
  );
}
