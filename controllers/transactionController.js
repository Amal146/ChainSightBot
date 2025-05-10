exports.analyzeTransaction = async (req, res) => {
  const { txHash } = req.body;

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
