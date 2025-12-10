import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import { variants, transitions, getVariants, getTransition } from '../design/motion';
import './Footer.css';

export function Footer() {
  const shouldAnimate = useShouldAnimate();

  const fadeVariants = getVariants(variants.fade, shouldAnimate);
  const midTransition = getTransition({ ...transitions.mid, delay: 0.3 }, shouldAnimate);

  return (
    <motion.footer
      className="footer"
      initial="initial"
      animate="animate"
      variants={fadeVariants}
      transition={midTransition}
    >
      <p>
        Built with ❤️ using React & HuggingFace |{' '}
        <motion.a
          href="https://huggingface.co/Qwen/Qwen2.5-72B-Instruct"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
          whileHover={shouldAnimate ? { scale: 1.05 } : {}}
          transition={transitions.micro}
        >
          Learn about Qwen
        </motion.a>
      </p>
    </motion.footer>
  );
}
