
require('dotenv').config();
const axios = require('axios');


const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Map of numberId to API endpoints
const API_ENDPOINTS = {
    p: `${BASE_URL}/primes`,
    f: `${BASE_URL}/fibo`,
    e: `${BASE_URL}/even`,
    r: `${BASE_URL}/rand`
};


const WINDOW_SIZE = 10;


let numberWindow = [];


const fetchAndCalculateAverage = async (numberId) => {

    const url = API_ENDPOINTS[numberId];
    const token = process.env.AUTH_TOKEN;


    const windowPrevState = [...numberWindow];


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

 
    const uniqueNumbers = [...new Set([...numberWindow, ...fetchedNumbers])];


    numberWindow = uniqueNumbers.slice(-WINDOW_SIZE);

   
    const windowCurrState = [...numberWindow];


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
