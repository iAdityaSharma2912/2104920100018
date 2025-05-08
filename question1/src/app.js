// src/app.js
const express = require('express');
const numberRoutes = require('./routes/numbers');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/numbers', numberRoutes);

// Start the server
const PORT = process.env.PORT || 9876;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;