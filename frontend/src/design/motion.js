/**
 * Motion Design Tokens
 * Centralized animation constants for consistency across the application
 * 
 * Rules enforced:
 * - Only transform and opacity animations (compositor-friendly)
 * - Three duration tiers: micro, mid, nav
 * - Three easing curves: enter, exit, inOut
 * - Single stagger value for sequences
 */

/**
 * Duration tokens in milliseconds
 * micro: 120-180ms - micro-interactions, button states
 * mid: 200-350ms - component transitions, reveals
 * nav: 350-700ms - page transitions, modals
 */
export const durations = {
  micro: 150,
  mid: 280,
  nav: 450,
};

/**
 * Duration tokens in seconds (for Framer Motion)
 */
export const durationsSeconds = {
  micro: durations.micro / 1000,
  mid: durations.mid / 1000,
  nav: durations.nav / 1000,
};

/**
 * Easing curves as cubic-bezier values
 * enter: deceleration curve for elements entering
 * exit: acceleration curve for elements leaving
 * inOut: symmetric curve for state changes
 */
export const easings = {
  enter: [0.0, 0.0, 0.2, 1.0],
  exit: [0.4, 0.0, 1.0, 1.0],
  inOut: [0.4, 0.0, 0.2, 1.0],
};

/**
 * CSS cubic-bezier strings
 */
export const easingsCSS = {
  enter: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
  exit: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
};

/**
 * Stagger delay for sequenced animations (ms)
 */
export const stagger = 40;

/**
 * Stagger delay in seconds (for Framer Motion)
 */
export const staggerSeconds = stagger / 1000;

/**
 * Pre-built animation variants for Framer Motion
 * Only uses transform and opacity (compositor-safe)
 */
export const variants = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Fade + slide up
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  // Fade + slide down
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },

  // Fade + scale
  fadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Slide from left
  slideLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },

  // Slide from right
  slideRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
};

/**
 * Transition presets for Framer Motion
 */
export const transitions = {
  micro: {
    duration: durationsSeconds.micro,
    ease: easings.inOut,
  },
  mid: {
    duration: durationsSeconds.mid,
    ease: easings.enter,
  },
  nav: {
    duration: durationsSeconds.nav,
    ease: easings.enter,
  },
  exit: {
    duration: durationsSeconds.micro,
    ease: easings.exit,
  },
};

/**
 * Stagger container variants for child animations
 */
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerSeconds,
      delayChildren: 0,
    },
  },
  exit: {
    transition: {
      staggerChildren: staggerSeconds / 2,
      staggerDirection: -1,
    },
  },
};

/**
 * Static fallback - no animation, preserves layout
 */
export const staticVariants = {
  initial: {},
  animate: {},
  exit: {},
};

/**
 * Get variants based on reduced motion preference
 * @param {Object} animatedVariants - Variants to use when animated
 * @param {boolean} shouldAnimate - Whether animation is enabled
 * @returns {Object} Appropriate variants
 */
export function getVariants(animatedVariants, shouldAnimate) {
  return shouldAnimate ? animatedVariants : staticVariants;
}

/**
 * Get transition based on reduced motion preference
 * @param {Object} animatedTransition - Transition to use when animated
 * @param {boolean} shouldAnimate - Whether animation is enabled
 * @returns {Object} Appropriate transition
 */
export function getTransition(animatedTransition, shouldAnimate) {
  return shouldAnimate ? animatedTransition : { duration: 0 };
}
