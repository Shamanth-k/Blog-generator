import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import {
  variants,
  transitions,
  getVariants,
  getTransition,
  staggerContainer,
} from '../design/motion';

/**
 * Animated wrapper component
 * Provides consistent animation behavior with reduced motion support
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'fade' | 'fadeUp' | 'fadeDown' | 'fadeScale' | 'slideLeft' | 'slideRight'} [props.variant='fadeUp']
 * @param {'micro' | 'mid' | 'nav'} [props.transition='mid']
 * @param {boolean} [props.shouldAnimate] - Local override (can only disable)
 * @param {number} [props.delay=0] - Animation delay in seconds
 * @param {string} [props.className]
 * @param {Object} [props.style]
 * @param {string} [props.as='div'] - HTML element to render
 */
export function Animated({
  children,
  variant = 'fadeUp',
  transition = 'mid',
  shouldAnimate: localShouldAnimate,
  delay = 0,
  className,
  style,
  as = 'div',
  ...props
}) {
  const shouldAnimate = useShouldAnimate(localShouldAnimate);

  const selectedVariants = getVariants(variants[variant], shouldAnimate);
  const selectedTransition = getTransition(
    { ...transitions[transition], delay },
    shouldAnimate
  );

  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariants}
      transition={selectedTransition}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Stagger container for animating children in sequence
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.shouldAnimate] - Local override
 * @param {string} [props.className]
 * @param {string} [props.as='div']
 */
export function StaggerContainer({
  children,
  shouldAnimate: localShouldAnimate,
  className,
  as = 'div',
  ...props
}) {
  const shouldAnimate = useShouldAnimate(localShouldAnimate);

  const selectedVariants = shouldAnimate ? staggerContainer : {};

  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Stagger item - must be child of StaggerContainer
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'fade' | 'fadeUp' | 'fadeDown' | 'fadeScale'} [props.variant='fadeUp']
 * @param {string} [props.className]
 * @param {string} [props.as='div']
 */
export function StaggerItem({
  children,
  variant = 'fadeUp',
  className,
  as = 'div',
  ...props
}) {
  const shouldAnimate = useShouldAnimate();

  const selectedVariants = getVariants(variants[variant], shouldAnimate);

  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={selectedVariants}
      transition={transitions.mid}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Fade wrapper - simple opacity animation
 */
export function Fade({ children, ...props }) {
  return (
    <Animated variant="fade" transition="micro" {...props}>
      {children}
    </Animated>
  );
}

/**
 * FadeUp wrapper - fade with upward motion
 */
export function FadeUp({ children, ...props }) {
  return (
    <Animated variant="fadeUp" transition="mid" {...props}>
      {children}
    </Animated>
  );
}

/**
 * FadeScale wrapper - fade with scale
 */
export function FadeScale({ children, ...props }) {
  return (
    <Animated variant="fadeScale" transition="mid" {...props}>
      {children}
    </Animated>
  );
}
