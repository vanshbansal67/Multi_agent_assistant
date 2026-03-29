const express = require('express');
const cors = require('cors');
const { startAssistant } = require('./agent');

const app = express();

// Frontend se API call allow karne ke liye
app.use(cors());
app.use(express.json());

// 🟢 Health Check Route (Cloud Run ki requirement taaki deployment fail na ho)
app.get('/', (req, res) => {
    res.status(200).send("🚀 Agent Server is LIVE and healthy!");
});

// 🤖 Chat Endpoint
app.post('/chat', async (req, res) => {
    try {
        // req.body.prompt ya req.body.message, dono handle karega
        const userMessage = req.body.prompt || req.body.message;
        const result = await startAssistant(userMessage);
        res.json({ reply: result });
    } catch (error) {
        console.error("Agent Error:", error);
        res.status(500).json({ reply: "Bhai, agent theek se response nahi de pa raha hai." });
    }
});

// 🌐 Port Configuration (Cloud Run ki strict requirement)
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server successfully listening on port ${PORT}`);
});