const axios = require('axios');
const apiKey = process.env.ETHERSCAN_API_KEY;

exports.getTransactionDetails = async (txHash) => {
  const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`;

  const response = await axios.get(url);

  if (!response.data.result) throw new Error('Transaction not found');

  return response.data.result;
};
