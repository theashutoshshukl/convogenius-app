const express = require("express");
const { openAiResponse } = require("../controllers/openaiController");
const auth = require("../middleware/auth");
const openAiRouter = express.Router();

// Get openai response
openAiRouter.post("/api", auth, openAiResponse);

module.exports = openAiRouter;