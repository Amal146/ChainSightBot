require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key:", apiKey);

// Validate key
console.assert(apiKey.trim() === apiKey, "API key has extra whitespace.");
console.assert(apiKey.startsWith("AIza"), "API key should start with 'AIza'.");
console.assert(apiKey.length === 39, "API key length is incorrect.");

// Initialize genAI
const genAI = new GoogleGenerativeAI(apiKey);


genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
  .generateContent("Test prompt")
  .then(response => {
    console.log("Test Response:", response);
  })
  .catch(err => {
    console.log("Error:", err.message);
  });

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const prompt = `
You are a Swiss crypto tax expert AI assistant. Given the following Ethereum transaction details, explain:
1. What happened in simple terms (e.g. ETH transfer, token swap, DeFi action).
2. What it means in the context of Swiss tax law.
3. Include accurate and cited guidance from Swiss tax authorities (like ESTV, FINMA).
4. Return the output in **Markdown** format.

Transaction Data:
- Hash: 0xbebf4f0a32ebb5a313513e42b4d4c132462410e782c2a3161f04a77f0cfbe336
- From: 0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97
- To: 0x7e2a2fa2a064f693f0a55c5639476d913ff12d05
- ETH Value: 0.0807
- Input Data: None
- Block Number: 14189796

Use reliable information. Do NOT speculate. Include a source reference.
`;

model.generateContent(prompt)
  .then(res => res.response.text())
  .then(text => console.log("Gemini Markdown Output:\n", text))
  .catch(err => console.error("Gemini Error:", err.message));

exports.analyzeTransaction = async (req, res) => {
  const { txHash } = req.body;
  const { getTransactionDetails } = require('../services/etherscanService.js');
  const { interpretWithSwissTaxLaw } = require('../utils/swissTaxRules.js');
  

  if (!txHash) return res.status(400).json({ error: 'Transaction hash required' });

  try {
    const txData = await getTransactionDetails(txHash);
    const interpretation = await interpretWithSwissTaxLaw(txData);

    res.json({
      transaction: txData,
      interpretation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
