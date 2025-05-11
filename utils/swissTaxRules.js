require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

exports.interpretWithSwissTaxLaw = async (txData) => {
  const { hash, from, to, value, input, blockNumber } = txData;
  const ethTransferred = parseInt(value, 16) / 1e18;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });


  const prompt = `
You are a Swiss crypto tax expert AI assistant. Given the following Ethereum transaction details, explain:
1. What happened in simple terms (e.g. ETH transfer, token swap, DeFi action).
2. What it means in the context of Swiss tax law.
3. Include accurate and cited guidance from Swiss tax authorities (like ESTV, FINMA).
4. Return the output in **Markdown** format.

Transaction Data:
- Hash: ${hash}
- From: ${from}
- To: ${to}
- ETH Value: ${ethTransferred}
- Input Data: ${input ? input.substring(0, 100) + '...' : 'None'}
- Block Number: ${parseInt(blockNumber, 16)}

Use reliable information. Do NOT speculate. Include a source reference.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      summary: `AI Interpretation for transaction ${hash}`,
      interpretation: text,
      ai: 'Gemini',
    };
  } catch (err) {
    return {
      summary: 'Gemini failed to interpret the transaction.',
      error: err.message,
      ai: 'Gemini',
    };
  }
};
