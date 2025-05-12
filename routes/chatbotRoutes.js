// routes/chatbotRoutes.js

const express = require("express");
const { askGemini } = require("../controllers/chatbotController");


const router = express.Router();

router.post("/chat", askGemini);

module.exports = router;

