import { motion } from 'framer-motion';
import { useShouldAnimate } from '../design';
import { variants, transitions, getVariants, getTransition, staggerContainer } from '../design/motion';
import './Features.css';

const FEATURES = [
  {
    id: 1,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 8H24V24H8V8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 14H20M12 18H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Enter Your Prompt',
    description: 'Simply type in your topic or idea. The clearer your prompt, the better your blog.',
  },
  {
    id: 2,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 4V28M16 4L10 10M16 4L22 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 28H26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Generate Your Blog',
    description: 'AI creates a comprehensive 1000+ word article with proper structure and flow.',
  },
  {
    id: 3,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M20 8L24 12L14 22H10V18L20 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 26H24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Edit & Export',
    description: 'Copy your blog instantly and refine it to match your unique voice and style.',
  },
];

/**
 * Features section with three-column grid
 */
export function Features() {
  const shouldAnimate = useShouldAnimate();

  const fadeUpVariants = getVariants(variants.fadeUp, shouldAnimate);
  const fadeVariants = getVariants(variants.fade, shouldAnimate);
  const containerVariants = shouldAnimate ? staggerContainer : {};

  return (
    <section className="features">
      <div className="features__container">
        <motion.div
          className="features__header"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUpVariants}
          transition={getTransition(transitions.mid, shouldAnimate)}
        >
          <h2 className="features__title">
            Designed to Help You Do More
            <br />
            <span className="features__title-accent">With Less Stress</span>
          </h2>
          <p className="features__subtitle">
            Three simple steps to transform your ideas into publish-ready content.
          </p>
        </motion.div>

        <motion.div
          className="features__grid"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.id}
              className="feature-card"
              variants={fadeUpVariants}
              transition={getTransition(
                { ...transitions.mid, delay: index * 0.1 },
                shouldAnimate
              )}
            >
              <div className="feature-card__icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
              <span className="feature-card__step">Step {feature.id}</span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
