require('dotenv').config();  // Ensure environment variables are loaded
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Environment variables for API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to handle requests from Roblox
app.post('/chatgpt', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    // Make a request to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/completions',  // Update if needed
      {
        model: 'text-davinci-003',  // Update model as needed
        prompt,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if the response has choices and text
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      res.json({ text: response.data.choices[0].text.trim() });
    } else {
      res.status(500).json({ error: 'No choices returned from OpenAI API' });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
