const express = require('express');
const { startAssistant } = require('./agent');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    const result = await startAssistant(req.body.prompt);
    res.json({ reply: result });
});

// server.js mein ise change karo
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});