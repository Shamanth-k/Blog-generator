import { createContext, useContext, useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Motion context shape
 * @typedef {Object} MotionContextValue
 * @property {boolean} shouldAnimate - Whether animations should play
 * @property {boolean} reducedMotion - User's reduced motion preference
 * @property {boolean} forceStatic - Programmatic override to disable all motion
 */

const MotionContext = createContext({
  shouldAnimate: true,
  reducedMotion: false,
  forceStatic: false,
});

/**
 * Motion Provider - controls animation state globally
 * Honors prefers-reduced-motion and provides programmatic control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.forceStatic=false] - Force disable all animations
 */
export function MotionProvider({ children, forceStatic = false }) {
  const reducedMotion = useReducedMotion();

  const value = useMemo(
    () => ({
      shouldAnimate: !reducedMotion && !forceStatic,
      reducedMotion,
      forceStatic,
    }),
    [reducedMotion, forceStatic]
  );

  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  );
}

/**
 * Hook to access motion context
 * @returns {MotionContextValue}
 */
export function useMotion() {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
}

/**
 * Hook to get shouldAnimate value with optional local override
 * @param {boolean} [localOverride] - Local component override
 * @returns {boolean}
 */
export function useShouldAnimate(localOverride) {
  const { shouldAnimate } = useMotion();
  
  // Local override can only disable, not enable
  if (localOverride === false) {
    return false;
  }
  
  return shouldAnimate;
}
