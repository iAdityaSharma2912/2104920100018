# Question 1: Average Calculator Microservice

This project implements a REST API `/numbers/{numberId}` that fetches numbers from a third-party server, maintains a window of size 10, and calculates their average.

## Setup
1. Clone the repository.
2. Navigate to `question1/`.
3. Run `npm install` to install dependencies.
4. Create a `.env` file with the required environment variables (PORT, AUTH_TOKEN).
5. Run `npm start` to start the server.

## API
- **GET /numbers/{numberId}**: Fetches numbers based on `numberId` (p, f, e, r), maintains a window of size 10, and returns the average.

## Screenshots
![WhatsApp Image 2025-05-08 at 13 05 02_6b799acd](https://github.com/user-attachments/assets/49bb2778-df63-40ed-9fba-5d4a730bc502)
![WhatsApp Image 2025-05-08 at 13 05 07_57aa354c](https://github.com/user-attachments/assets/a8361a41-64c5-4a56-b973-d19d380ff7e9)
