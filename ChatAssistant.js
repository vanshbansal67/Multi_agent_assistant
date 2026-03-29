import React, { useState } from 'react';
import axios from 'axios';

const ChatAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        const userMsg = { role: 'user', text: input };
        setMessages([...messages, userMsg]);

        try {
            const res = await axios.post('http://localhost:5000/api/chat', { message: input });
            const botMsg = { role: 'bot', text: res.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error("Bhai, server check kar!", err);
        }
        setInput('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>AI Productivity Assistant 🚀</h2>
            <div style={{ height: '400px', border: '1px solid #ccc', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
                {messages.map((m, i) => (
                    <p key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
                        <strong>{m.role === 'user' ? 'You' : 'Agent'}:</strong> {m.text}
                    </p>
                ))}
            </div>
            <input value={input} onChange={(e) => setInput(e.target.value)} style={{ width: '80%' }} placeholder="Bhai, kya kaam hai?" />
            <button onClick={sendMessage}>Bhejo</button>
        </div>
    );
};

export default ChatAssistant;