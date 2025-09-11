// api/smsbower.js — Vercel serverless endpoint (proxy to SMSBower)
export default async function handler(req, res) {
  try {
    // This endpoint forwards request to SMSBower and returns JSON.
    // Make sure you add SMSBOWER_API_KEY in Vercel environment variables (see step 4).
    const resp = await fetch('https://api.smsbower.com/api/v1/countries', {
      headers: {
        'Authorization': `Bearer ${process.env.SMSBOWER_API_KEY}`,
        'Accept': 'application/json'
      },
      method: 'GET'
    });

    const text = await resp.text();
    // try to parse JSON
    try {
      const data = JSON.parse(text);
      return res.status(resp.status).json(data);
    } catch (e) {
      // if SMSBower returned non-JSON, send raw text
      return res.status(resp.status).send(text);
    }

  } catch (err) {
    console.error('smsbower proxy error', err);
    return res.status(500).json({ error: 'SMSBower proxy failed', details: err.message });
  }
}
