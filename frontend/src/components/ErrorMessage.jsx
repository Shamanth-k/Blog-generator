import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import { variants, transitions, getVariants, getTransition } from '../design/motion';
import './ErrorMessage.css';

/**
 * @param {{message: string}} props
 */
export function ErrorMessage({ message }) {
  const shouldAnimate = useShouldAnimate();

  if (!message) return null;

  const fadeScaleVariants = getVariants(variants.fadeScale, shouldAnimate);
  const midTransition = getTransition(transitions.mid, shouldAnimate);

  return (
    <motion.div
      className="error-message"
      role="alert"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeScaleVariants}
      transition={midTransition}
    >
      <motion.span
        className="error-message__icon"
        aria-hidden="true"
        animate={shouldAnimate ? { scale: [1, 1.2, 1] } : {}}
        transition={shouldAnimate ? { duration: 0.5, repeat: 2 } : {}}
      >
        ⚠️
      </motion.span>
      <p className="error-message__text">{message}</p>
    </motion.div>
  );
}
