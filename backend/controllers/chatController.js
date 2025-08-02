const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.askGemini = async (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: data.error?.message || 'Gemini API error', details: data });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({ response: answer });
  } catch (err) {
    console.error('Failed to contact Gemini API:', err);
    res.status(500).json({ error: 'Failed to contact Gemini API', details: err.message });
  }
}; 