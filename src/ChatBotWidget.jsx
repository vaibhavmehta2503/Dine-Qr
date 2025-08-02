import React, { useState, useEffect, useRef } from 'react';
// Remove direct import and usage of GoogleGenAI

const API_URL = 'http://localhost:5000/api/chat';

// Chef hat SVG icon
const ChefHatIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="16" rx="16" ry="16" fill="#FFF6E5"/>
    <path d="M7 18c-1.5-4 1.5-6.5 4.5-5.5 0-3 6-3 6 0 3-1 6 1.5 4.5 5.5" stroke="#D4AF37" strokeWidth="1.5" fill="#fff"/>
    <ellipse cx="16" cy="23" rx="6" ry="2.5" fill="#D4AF37"/>
  </svg>
);

const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Remove direct import and usage of GoogleGenAI

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setMessages(msgs => [...msgs, { text: input, sender: 'user' }]);
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
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

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[var(--dineqr-gold)] to-[var(--dineqr-blue)] text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-3xl focus:outline-none animate-bounce-slow hover:scale-105 transition-transform"
        aria-label="Open ChatBot"
        style={{ boxShadow: '0 4px 24px 0 rgba(32,64,128,0.15)' }}
      >
        <ChefHatIcon />
      </button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[95vw] card flex flex-col chat-gradient overflow-hidden" style={{borderWidth: '2.5px', boxShadow: '0 6px 24px 0 rgba(212,175,55,0.10)', padding: '0.5rem 0.5rem 1.25rem 0.5rem', backdropFilter: 'blur(2px)'}}>
          <div className="flex items-center justify-between px-4 py-3 rounded-t-xl border-b-4" style={{background: 'var(--dineqr-blue)', color: '#fff', borderBottom: '3px solid var(--dineqr-gold)'}}>
            <span className="font-bold text-lg tracking-wide">AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-yellow-200 text-2xl font-bold px-2 transition-colors">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto max-h-80" style={{ minHeight: 200 }}>
            {messages.length === 0 && (
              <div className="text-[#888] text-center mt-8" style={{fontWeight: 500}}>Ask me anything about your orders, menu, or inventory!</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow chat-bubble-${msg.sender}`} style={{
                  background: msg.sender === 'user' ? 'var(--dineqr-blue)' : 'var(--dineqr-gold)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--dineqr-brown)',
                  fontWeight: 500,
                  boxShadow: '0 2px 12px 0 rgba(32,64,128,0.10)'
                }}>
                  {msg.text || (msg.error && msg.error.message) || 'Error'}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendPrompt} className="flex border-t p-2 bg-[var(--dineqr-gray)] rounded-b-xl gap-3 chat-input-area items-center w-full overflow-hidden" style={{boxSizing: 'border-box'}}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-[var(--dineqr-blue)] transition-all text-[var(--dineqr-brown)] bg-white text-base h-12 min-w-0"
              style={{borderColor: 'var(--dineqr-gold)', minHeight: '3rem', maxWidth: '100%'}} 
              placeholder="Ask Gemini..."
              disabled={loading}
            />
            <button
              type="submit"
              className="btn-gold px-5 py-2 rounded-full font-semibold transition hover:scale-105 hover:shadow-lg disabled:opacity-60 h-12 flex items-center justify-center text-lg flex-shrink-0"
              style={{color: 'var(--dineqr-blue)', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px 0 rgba(32,64,128,0.10)'}}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget; 