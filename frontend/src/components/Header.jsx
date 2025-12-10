import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import { variants, transitions, getVariants, getTransition } from '../design/motion';
import './Header.css';

export function Header() {
  const shouldAnimate = useShouldAnimate();

  const fadeDownVariants = getVariants(variants.fadeDown, shouldAnimate);
  const fadeVariants = getVariants(variants.fade, shouldAnimate);
  const navTransition = getTransition(transitions.nav, shouldAnimate);
  const midTransition = getTransition({ ...transitions.mid, delay: 0.1 }, shouldAnimate);
  const delayedTransition = getTransition({ ...transitions.mid, delay: 0.2 }, shouldAnimate);

  return (
    <header className="header">
      <motion.h1
        className="header__title"
        initial="initial"
        animate="animate"
        variants={fadeDownVariants}
        transition={navTransition}
      >
        ✨ AI Blog Generator
      </motion.h1>
      <motion.p
        className="header__subtitle"
        initial="initial"
        animate="animate"
        variants={fadeVariants}
        transition={midTransition}
      >
        Transform your ideas into compelling blog posts instantly
      </motion.p>
      <motion.span
        className="header__badge"
        initial="initial"
        animate="animate"
        variants={fadeVariants}
        transition={delayedTransition}
      >
        Powered by Qwen2.5-72B-Instruct
      </motion.span>
    </header>
  );
}
