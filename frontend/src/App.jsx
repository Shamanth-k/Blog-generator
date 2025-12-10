import {
  Hero,
  Features,
  ErrorBoundary,
  ErrorMessage,
  LoadingState,
  AnimatePresenceWrapper,
  FadeUp,
} from './components';
import { BlogInput, BlogOutput, useBlogGeneration } from './features/blog';
import { MotionProvider } from './design';
import './styles/global.css';

export default function App() {
  const { state, generate, reset } = useBlogGeneration();

  const isLoading = state.status === 'loading';
  const hasError = state.status === 'error';
  const hasResult = state.status === 'success';

  return (
    <MotionProvider>
      <div className="app">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Prompt Section */}
        <section id="prompt-section" className="prompt-section">
          <div className="prompt-section__container">
            <ErrorBoundary>
              <BlogInput onSubmit={generate} isLoading={isLoading} />

              <AnimatePresenceWrapper mode="wait">
                {hasError && (
                  <FadeUp key="error">
                    <ErrorMessage message={state.error} />
                  </FadeUp>
                )}

                {isLoading && (
                  <FadeUp key="loading">
                    <LoadingState message="Creating your blog post..." />
                  </FadeUp>
                )}

                {hasResult && (
                  <FadeUp key="result">
                    <BlogOutput
                      blog={state.blog}
                      prompt={state.prompt}
                      meta={state.meta}
                      onReset={reset}
                    />
                  </FadeUp>
                )}
              </AnimatePresenceWrapper>
            </ErrorBoundary>
          </div>
        </section>
      </div>
    </MotionProvider>
  );
}
