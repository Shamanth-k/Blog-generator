const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// HuggingFace API configuration - using text generation inference
const HUGGINGFACE_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Blog generation endpoint
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Please provide a valid prompt' });
    }

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [
          { 
            role: "user", 
            content: `You are an expert blog writer. Write a well-structured, engaging, and informative blog post of approximately 1000 words on the following topic: ${prompt}

Requirements:
- Include a catchy title (use # for the main title)
- Write an engaging introduction  
- Use clear headings and subheadings (use ## and ### for headings)
- Include relevant examples and insights
- Write a compelling conclusion
- Use proper formatting with paragraphs
- Make the content informative and reader-friendly

Write the complete blog post now.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout for long generation
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const blogContent = response.data.choices[0].message.content;
      res.json({ 
        success: true, 
        blog: blogContent,
        prompt: prompt
      });
    } else {
      throw new Error('Invalid response from AI model');
    }

  } catch (error) {
    console.error('Error generating blog:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      // HuggingFace API error
      if (error.response.status === 503) {
        return res.status(503).json({ 
          error: 'Model is loading. Please try again in a few seconds.',
          loading: true
        });
      }
      return res.status(error.response.status).json({ 
        error: error.response.data?.error || 'Error from AI service'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate blog. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blog Generator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
