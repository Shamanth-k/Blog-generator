import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * AnimatePresence wrapper for mount/unmount transitions
 * Enables exit animations for components being removed from DOM
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'sync' | 'wait' | 'popLayout'} [props.mode='wait'] - Animation mode
 * @param {boolean} [props.initial=true] - Whether to animate on initial render
 * @param {Function} [props.onExitComplete] - Callback when exit animation completes
 */
export function AnimatePresenceWrapper({
  children,
  mode = 'wait',
  initial = true,
  onExitComplete,
}) {
  return (
    <AnimatePresence
      mode={mode}
      initial={initial}
      onExitComplete={onExitComplete}
    >
      {children}
    </AnimatePresence>
  );
}

AnimatePresenceWrapper.propTypes = {
  children: PropTypes.node,
  mode: PropTypes.oneOf(['sync', 'wait', 'popLayout']),
  initial: PropTypes.bool,
  onExitComplete: PropTypes.func,
};
