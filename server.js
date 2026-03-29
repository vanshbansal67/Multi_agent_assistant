const express = require('express');
const { startAssistant } = require('./agent');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    const result = await startAssistant(req.body.prompt);
    res.json({ reply: result });
});

app.listen(3000, () => console.log("Server 3000 par chalu hai!"));