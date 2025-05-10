const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// This is the endpoint you are POSTing to from React
app.post("/api/analyze", async (req, res) => {
  const { txHash } = req.body;
  // Call the analysis logic here (Etherscan + Swiss Tax rules + AI)
  const result = await analyzeTransaction(txHash); // example function
  res.json(result);
});

// Optional: health check
app.get("/", (req, res) => {
  res.send("ChainsightBot backend is running.");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
