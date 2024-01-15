const dotenv = require('dotenv');
const OpenAI = require("openai");

dotenv.config();
const API_KEY = process.env.API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

// OpenAi Code
const openAiResponse = (req, res) => {
    let { text } = req.body;
    let messages = [];

    // Random number genrator
    const randomGenrator = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    try {
        async function main(text) {
            messages.push({ role: "user", content: text });
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            res.status(200).json({ response: chatCompletion.choices[0]?.message?.content, id: randomGenrator(1657, 7780) });
        }
        main(text);

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while getting a response from OpenAI.");
    }
}

module.exports = { openAiResponse }