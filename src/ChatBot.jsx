import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api/chat';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setMessages(msgs => [...msgs, { text: input, sender: 'user' }]);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { text: data.response, sender: 'bot' }]);
    } catch {
      setMessages(msgs => [...msgs, { text: 'Error contacting Gemini API.', sender: 'bot' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="card p-6 max-w-lg mx-auto">
        <h1 className="text-2xl card-header mb-4 flex items-center gap-2">🤖 AI ChatBot (Gemini)</h1>
        <div className="bg-[var(--dineqr-gray)] p-4 rounded mb-4 h-64 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <span style={{
                color: msg.sender === 'user' ? 'var(--dineqr-blue)' : 'var(--dineqr-gold)',
                background: msg.sender === 'user' ? 'rgba(32,64,128,0.08)' : 'rgba(212,175,55,0.08)',
                borderRadius: '1rem',
                padding: '0.25rem 0.75rem',
                display: 'inline-block',
                margin: '0.15rem 0',
                fontWeight: 500
              }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={sendPrompt} className="flex">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border p-2 rounded-l"
            placeholder="Ask Gemini..."
          />
          <button type="submit" className="btn-blue px-4 rounded-r" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot; 