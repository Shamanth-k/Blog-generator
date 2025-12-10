import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:5000';

function App() {
  const [prompt, setPrompt] = useState('');
  const [blog, setBlog] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const samplePrompts = [
    "The Future of Artificial Intelligence",
    "Sustainable Living Tips",
    "Remote Work Best Practices",
    "Mental Health Awareness",
    "Space Exploration in 2024"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a topic for your blog');
      return;
    }

    setLoading(true);
    setError('');
    setBlog('');

    try {
      const response = await axios.post(`${API_URL}/api/generate-blog`, {
        prompt: prompt.trim()
      });

      if (response.data.success) {
        setBlog(response.data.blog);
        setGeneratedPrompt(response.data.prompt);
      } else {
        setError(response.data.error || 'Failed to generate blog');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.data?.loading) {
        setError('The AI model is warming up. Please wait a moment and try again.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to generate blog. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sample) => {
    setPrompt(sample);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blog);
    alert('Blog copied to clipboard!');
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleNewBlog = () => {
    setBlog('');
    setPrompt('');
    setGeneratedPrompt('');
    setError('');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>✨ AI Blog Generator</h1>
        <p>Transform your ideas into compelling blog posts instantly</p>
        <span className="model-badge">Powered by Qwen2.5-72B-Instruct</span>
      </header>

      <main className="main-content">
        <section className="input-section">
          <h2><span className="icon">📝</span> Enter Your Topic</h2>
          
          <form onSubmit={handleSubmit} className="prompt-form">
            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your blog topic or idea here... (e.g., 'The Benefits of Morning Meditation' or 'How to Start a Successful Online Business')"
              disabled={loading}
            />
            
            <div className="char-count">
              {prompt.length} characters
            </div>

            <button 
              type="submit" 
              className="generate-btn"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  🚀 Generate Blog
                </>
              )}
            </button>
          </form>

          <div className="tips">
            <span style={{ color: '#64748b', marginRight: '0.5rem' }}>Try:</span>
            {samplePrompts.map((sample, index) => (
              <span 
                key={index} 
                className="tip"
                onClick={() => handleSampleClick(sample)}
              >
                {sample}
              </span>
            ))}
          </div>
        </section>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Creating your blog post...</p>
            <p className="loading-tips">This may take up to a minute. The AI is crafting a comprehensive ~1000 word article.</p>
          </div>
        )}

        {blog && !loading && (
          <section className="blog-output">
            <div className="blog-header">
              <h2>📄 Generated Blog</h2>
              <div className="blog-actions">
                <button className="action-btn" onClick={copyToClipboard}>
                  📋 Copy
                </button>
                <button className="action-btn" onClick={handleNewBlog}>
                  ✨ New Blog
                </button>
              </div>
            </div>
            
            <div className="blog-content">
              <ReactMarkdown>{blog}</ReactMarkdown>
            </div>

            <div className="blog-meta">
              <span>Topic: <strong>{generatedPrompt}</strong></span>
              <span className="word-count">{countWords(blog)} words</span>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Built with ❤️ using React & Mistral AI | 
          <a href="https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1" target="_blank" rel="noopener noreferrer"> Learn about Mixtral</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
