// src/services/numberService.js
require('dotenv').config();
const axios = require('axios');

// Base URL for the third-party server
const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Map of numberId to API endpoints
const API_ENDPOINTS = {
    p: `${BASE_URL}/primes`,
    f: `${BASE_URL}/fibo`,
    e: `${BASE_URL}/even`,
    r: `${BASE_URL}/rand`
};

// Window size
const WINDOW_SIZE = 10;

// Store numbers in memory (in a real app, use a database)
let numberWindow = [];

// Function to fetch numbers and calculate average
const fetchAndCalculateAverage = async (numberId) => {
    // Get the API endpoint
    const url = API_ENDPOINTS[numberId];
    const token = process.env.AUTH_TOKEN;

    // Previous state of the window
    const windowPrevState = [...numberWindow];

    // Fetch numbers from the third-party server
    let fetchedNumbers = [];
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            timeout: 500 // Timeout after 500ms
        });

        fetchedNumbers = response.data.numbers || [];
    } catch (error) {
        // Ignore errors or timeouts
        fetchedNumbers = [];
    }

    // Filter out duplicates and add new numbers to the window
    const uniqueNumbers = [...new Set([...numberWindow, ...fetchedNumbers])];

    // Update the window: if size exceeds WINDOW_SIZE, remove the oldest numbers
    numberWindow = uniqueNumbers.slice(-WINDOW_SIZE);

    // Current state of the window
    const windowCurrState = [...numberWindow];

    // Calculate the average (rounded to 2 decimal places)
    const avg = numberWindow.length > 0
        ? Number((numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2))
        : 0;

    return {
        windowPrevState,
        windowCurrState,
        numbers: fetchedNumbers,
        avg
    };
};

module.exports = { fetchAndCalculateAverage };