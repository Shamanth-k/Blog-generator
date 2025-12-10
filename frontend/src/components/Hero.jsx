import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import { variants, transitions, getVariants, getTransition } from '../design/motion';
import './Hero.css';

/**
 * Hero section with intro, headline, subtext, and CTA button
 */
export function Hero() {
  const shouldAnimate = useShouldAnimate();

  const fadeUpVariants = getVariants(variants.fadeUp, shouldAnimate);
  const fadeVariants = getVariants(variants.fade, shouldAnimate);

  const handleScrollToPrompt = () => {
    const promptSection = document.getElementById('prompt-section');
    if (promptSection) {
      promptSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero__content">
        <motion.span
          className="hero__intro"
          initial="initial"
          animate="animate"
          variants={fadeVariants}
          transition={getTransition(transitions.mid, shouldAnimate)}
        >
          AI-Powered Blog Generation
        </motion.span>

        <motion.h1
          className="hero__headline"
          initial="initial"
          animate="animate"
          variants={fadeUpVariants}
          transition={getTransition({ ...transitions.nav, delay: 0.1 }, shouldAnimate)}
        >
          Create compelling blogs
          <br />
          <span className="hero__headline-accent">in seconds</span>
        </motion.h1>

        <motion.p
          className="hero__subtext"
          initial="initial"
          animate="animate"
          variants={fadeVariants}
          transition={getTransition({ ...transitions.mid, delay: 0.2 }, shouldAnimate)}
        >
          Enter a simple prompt and let AI generate a comprehensive,
          well-structured 1000+ word blog post for you instantly.
        </motion.p>

        <motion.button
          className="hero__cta"
          onClick={handleScrollToPrompt}
          initial="initial"
          animate="animate"
          variants={fadeUpVariants}
          transition={getTransition({ ...transitions.mid, delay: 0.3 }, shouldAnimate)}
          whileHover={shouldAnimate ? { scale: 1.02, y: -2 } : {}}
          whileTap={shouldAnimate ? { scale: 0.98 } : {}}
        >
          Start Creating
          <svg
            className="hero__cta-arrow"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 3L10 17M10 17L16 11M10 17L4 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>

      {/* Gradient-backed website preview */}
      <motion.div
        className="hero__device-wrapper"
        initial="initial"
        animate="animate"
        variants={fadeUpVariants}
        transition={getTransition({ ...transitions.nav, delay: 0.4 }, shouldAnimate)}
      >
        <div className="hero__gradient-bg" aria-hidden="true" />
        <div className="hero__device">
          <div className="hero__device-header">
            <span className="hero__device-dot hero__device-dot--red" />
            <span className="hero__device-dot hero__device-dot--yellow" />
            <span className="hero__device-dot hero__device-dot--green" />
            <span className="hero__device-url">bloggen.ai</span>
          </div>
          <div className="hero__device-screen">
            {/* Stylized app preview */}
            <div className="hero__preview">
              <div className="hero__preview-header">
                <div className="hero__preview-logo"> AI Blog Generator</div>
              </div>
              <div className="hero__preview-content">
                <div className="hero__preview-input">
                  <div className="hero__preview-label">Write Your Prompt</div>
                  <div className="hero__preview-textarea">
                    {/* <span className="hero__preview-cursor" /> */}
                  </div>
                  <div className="hero__preview-button">
                    <span>🚀</span> Generate Blog
                  </div>
                </div>
                <div className="hero__preview-output">
                  <div className="hero__preview-output-header">Your Generated Blog</div>
                  <div className="hero__preview-lines">
                    <div className="hero__preview-line hero__preview-line--title" />
                    <div className="hero__preview-line" />
                    <div className="hero__preview-line" />
                    <div className="hero__preview-line hero__preview-line--short" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
