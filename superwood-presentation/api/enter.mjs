import { put } from '@vercel/blob';

const MAX_AGE = 30 * 24 * 3600; // 30 days

const enc = new TextEncoder();
async function hmacHex(data, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const ts = new Date().toISOString();
  const record = {
    email: cleanEmail,
    ts,
    ua: req.headers['user-agent'] || '',
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
    city: decodeURIComponent(req.headers['x-vercel-ip-city'] || ''),
    country: req.headers['x-vercel-ip-country'] || '',
  };
  try {
    await put(
      `deck-signups/${ts}-${cleanEmail.replace(/[^a-z0-9@._-]/g, '_')}.json`,
      JSON.stringify(record),
      { access: 'public', contentType: 'application/json' }
    );
  } catch (err) {
    // Blob store unavailable — keep the signup in function logs and let the viewer in.
    console.log('deck-signup (blob write failed):', JSON.stringify(record), err.message);
  }

  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${Buffer.from(cleanEmail, 'utf8').toString('base64url')}.${exp}`;
  const sig = await hmacHex(payload, process.env.AUTH_SECRET || '');
  res.setHeader(
    'Set-Cookie',
    `sw_auth=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`
  );
  return res.status(200).json({ redirect: `/?v=${encodeURIComponent(cleanEmail)}` });
}
