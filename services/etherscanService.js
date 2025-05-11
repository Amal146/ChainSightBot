//etherscanService.js
const axios = require('axios');
const apiKey = process.env.ETHERSCAN_API_KEY;

if (!apiKey) throw new Error("ETHERSCAN_API_KEY is missing in .env");

exports.getTransactionDetails = async (txHash) => {
  const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (!response.data.result) throw new Error('Transaction not found');
    return response.data.result;
  } catch (err) {
    throw new Error(`Etherscan API error: ${err.message}`);
  }
};
