const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
let windowCurrState = [];

const THIRD_PARTY_APIS = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand'
};

const FALLBACK_NUMBERS = {
  p: [2, 3, 5, 7, 11],
  f: [0, 1, 1, 2, 3],
  e: [2, 4, 6, 8, 10],
  r: [15, 23, 42, 7, 19]
};

// Bearer token for authentication
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Njg1NjM1LCJpYXQiOjE3NDY2ODUzMzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjEzMzQ4ZjczLWI2OWMtNGI2My05ZDU4LTkzYjM5MTg4M2RiYiIsInN1YiI6ImltYWRkeTI5MTJAZ21haWwuY29tIn0sImVtYWlsIjoiaW1hZGR5MjkxMkBnbWFpbC5jb20iLCJuYW1lIjoiYWRpdHlhIHNoYXJtYSIsInJvbGxObyI6IjIxMDQ5MjAxMDAwMTgiLCJhY2Nlc3NDb2RlIjoiYmFxaFdjIiwiY2xpZW50SUQiOiIxMzM0OGY3My1iNjljLTRiNjMtOWQ1OC05M2IzOTE4ODNkYmIiLCJjbGllbnRTZWNyZXQiOiJOVnJTdXF5VER0bkdDVUNZIn0.WIky4Y2R0Vqo8R9eD4xx7IsRhR7M5009nZqvmpEA-9k';
const authHeader = Bearer ${ACCESS_TOKEN};

app.use(express.json());

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0.00;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).json({ error: 'Invalid numberId. Use p, f, e, or r.' });
  }

  const apiUrl = THIRD_PARTY_APIS[numberId];
  const windowPrevState = [...windowCurrState];
  let fetchedNumbers = [];

  try {
    console.log(Fetching numbers from: ${apiUrl});
    const response = await axios.get(apiUrl, {
      timeout: 500,
      headers: {
        Authorization: authHeader // Include the Bearer token
      }
    });
    console.log('Response from third-party server:', response.data);
    fetchedNumbers = response.data.numbers || [];
    fetchedNumbers = [...new Set(fetchedNumbers)];
  } catch (error) {
    console.error(Error fetching numbers for ${numberId}:, error.response ? error.response.data : error.message);
    // Fallback to predefined numbers for testing
    fetchedNumbers = FALLBACK_NUMBERS[numberId] || [];
    console.log(Using fallback numbers for ${numberId}:, fetchedNumbers);
  }

  let updatedWindow = [...windowCurrState, ...fetchedNumbers];
  updatedWindow = [...new Set(updatedWindow)];

  if (updatedWindow.length > WINDOW_SIZE) {
    updatedWindow = updatedWindow.slice(updatedWindow.length - WINDOW_SIZE);
  }

  windowCurrState = updatedWindow;
  const avg = calculateAverage(windowCurrState);

  const responsePayload = {
    windowPrevState,
    windowCurrState,
    numbers: fetchedNumbers,
    avg
  };

  res.json(responsePayload);
});

app.listen(port, () => {
  console.log(Server running on http://localhost:${port});
});
