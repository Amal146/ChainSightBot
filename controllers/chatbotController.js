// controllers/chatbotController.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuration and Validation
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate API Key on startup
const validateApiKey = () => {
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing from environment variables");
    process.exit(1);
  }

  console.log(
    "🔑 API Key:",
    GEMINI_API_KEY ? `...${GEMINI_API_KEY.slice(-4)}` : "MISSING"
  );

  try {
    console.assert(
      GEMINI_API_KEY.trim() === GEMINI_API_KEY,
      "API key has extra whitespace."
    );
    console.assert(
      GEMINI_API_KEY.startsWith("AIza"),
      "API key should start with 'AIza'."
    );
    console.assert(
      GEMINI_API_KEY.length === 39,
      "API key length is incorrect."
    );
    console.log("✅ API Key format validation passed");
  } catch (err) {
    console.error("❌ API Key validation failed:", err.message);
    process.exit(1);
  }
};

// Initialize Gemini AI with connection test
let geminiModel;
const initializeGemini = async () => {
  try {
    validateApiKey();

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        maxOutputTokens: 150,
      },
    });

    // Test connection
    await geminiModel.generateContent("Connection test - respond with 'OK'");
    console.log("✅ Gemini AI connection successful");
    return true;
  } catch (err) {
    console.error("❌ Gemini initialization failed:", err.message);
    return false;
  }
};

// Run initialization when module loads
let isGeminiReady = false;
initializeGemini().then((success) => {
  isGeminiReady = success;
  if (!success) {
    console.error("⚠️ Server running with disabled Gemini functionality");
  }
});

// Controller Function
const askGemini = async (req, res) => {
  const { message } = req.body;

  if (!isGeminiReady) {
    return res.status(503).json({
      error: "Gemini service is currently unavailable",
      details: "API connection failed during server startup",
    });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await geminiModel.generateContent({
      contents: [
        {
          parts: [
            {
              text: `You are a helpful expert in blockchain forensics and tax optimization. ${message}
              Requirements:
      - Maximum 3 sentences
      - Each sentence under 25 words
      - No disclaimers (user knows to consult professionals)
      - Focus only on key actionable insights `,
            },
          ],
        },
      ],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const response = await result.response;
    const text = response.text();

    return res.json({ reply: text });
  } catch (error) {
    console.error("Gemini processing error:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      error: "Failed to process request with Gemini AI",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Swiss Tax Analysis Endpoint (from your second example)
const analyzeTransaction = async (req, res) => {
  const { txHash } = req.body;

  if (!txHash) {
    return res.status(400).json({ error: "Transaction hash required" });
  }

  try {
    const txData = await getTransactionDetails(txHash);
    const interpretation = await interpretWithSwissTaxLaw(txData);

    // Get Gemini's analysis
    const prompt = `
    As a Swiss crypto tax expert, analyze this transaction:
    ${JSON.stringify(txData, null, 2)}
    
    Provide:
    1. Transaction summary
    2. Swiss tax implications
    3. Relevant ESTV/FINMA guidelines
    4. Markdown formatted response
    `;

    const geminiResult = await geminiModel.generateContent(prompt);
    const geminiAnalysis = (await geminiResult.response).text();

    res.json({
      transaction: txData,
      localInterpretation: interpretation,
      geminiAnalysis,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
};

module.exports = {
  askGemini,
  analyzeTransaction,
  initializeGemini, // For manual testing
};
