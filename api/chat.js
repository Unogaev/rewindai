export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({error: 'Method not allowed'}); return; }

  try {
    const body = {...req.body};
    if (body.visualMode) {
      body.system = 'You are a web developer. Return ONLY raw HTML code. Start your response with <!DOCTYPE html> or <html>. Do NOT use markdown. Do NOT use backticks. Do NOT add any explanation. ONLY pure HTML.';
      delete body.visualMode;
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}
