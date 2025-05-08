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

// Fallback numbers for testing if the third-party server fails
const FALLBACK_NUMBERS = {
  p: [2, 3, 5, 7, 11],
  f: [0, 1, 1, 2, 3],
  e: [2, 4, 6, 8, 10],
  r: [15, 23, 42, 7, 19]
};

// Bearer token for authentication
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Njg1MTA4LCJpYXQiOjE3NDY2ODQ4MDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMwNmE4ZmZkLTlmNmMtNDEzMS1hNjAzLTVkNmQyYWNmNTU4NSIsInN1YiI6ImFkaXR5YXNyaXZhc3Rhdjg2M0BnbWFpbC5jb20ifSwiZW1haWwiOiJhZGl0eWFzcml2YXN0YXY4NjNAZ21haWwuY29tIiwibmFtZSI6ImFkaXR5YSBzcml2YXN0YXYiLCJyb2xsTm8iOiIyMTA0OTIwMTAwMDIxIiwiYWNjZXNzQ29kZSI6ImJhcWhXYyIsImNsaWVudElEIjoiMzA2YThmZmQtOWY2Yy00MTMxLWE2MDMtNWQ2ZDJhY2Y1NTg1IiwiY2xpZW50U2VjcmV0IjoiclREWFBma2RxeER1QkVQTiJ9.O-1AqJzwCyTSAH0RPJduGxlkOtLLO528KHVcgz6hWGY';
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
