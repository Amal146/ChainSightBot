
# ETH Tax Chatbot Backend 🧾🤖🇨🇭

This is the backend for a chatbot that:
- Simulates and explains Ethereum transactions using the **Etherscan API**
- Provides detailed **Swiss tax interpretations** using **Google Gemini AI**
- Returns formatted, reliable tax insights with **Swiss government source references (ESTV, FINMA)**

## 🔧 Tech Stack

- **Node.js + Express**
- **Etherscan API**
- **Google Gemini Pro AI**
- **Deployed on Render**

## 📦 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add a `.env` file:

   ```env
   PORT=5000
   ETHERSCAN_API_KEY=your_etherscan_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. Start the server:

   ```bash
   node index.js
   ```

## 🚀 Usage

Send a POST request to:

```
POST /api/analyze
Body: { "txHash": "0x..." }
```

Response:

* Etherscan transaction data
* Gemini-based interpretation (with Swiss tax law context)

## 🛡 Sources of Truth

This app is designed to use:

* 🇨🇭 [ESTV](https://www.estv.admin.ch/)
* 🇨🇭 [FINMA](https://www.finma.ch/)
* Ethereum blockchain transaction details

## 🧠 AI Model

* [Gemini Pro by Google](https://aistudio.google.com/app/apikey)

## 🧪 Testing

Use Postman, cURL, or a frontend to test the `/api/analyze` endpoint.

---

## 📬 Contact

Made by Amal for an AI Competition 🚀
Feel free to fork, contribute, or reach out!

````



