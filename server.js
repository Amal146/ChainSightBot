//server.js
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Basic rate limiter: 20 requests/minute
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many requests, please try again later."
}));

// Routes
app.use("/api", transactionRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("✅ ChainsightBot backend is running.");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Using Gemini API Key:", process.env.GEMINI_API_KEY);
  console.log(`🚀 Server listening on port ${PORT}`);
});







