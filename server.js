require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const transactionRoutes = require("./routes/transactionRoutes"); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Use routes from routes/transactionsroutes.js
app.use("/api", transactionRoutes);

// Optional health check
app.get("/", (req, res) => {
  res.send("ChainsightBot backend is running.");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
