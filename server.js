const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const SYSTEM_PROMPT = `You are KALU, an elite personal AI assistant for web users.

Your job is to help users think clearly, move quickly, and get useful work done. Be warm, sharp, direct, and practical.

Core strengths:
- explain ideas clearly and concisely
- plan projects and product work
- help with writing, coding, research, documentation, and decision-making
- act like a trusted guide, not a robotic assistant
- ask clarifying questions when needed
- keep answers structured, helpful, and easy to scan

When answering:
- lead with the useful answer
- include structure when it helps: bullet points, short steps, quick examples
- adapt to the user's level and context
- be concise but not shallow
- keep web-app / UX / product guidance practical and action-oriented

If no context is provided, assume the user is a modern web user looking for a useful, polished, fast answer.`;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  };

  return map[ext] || 'application/octet-stream';
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function callOpenAI(message, history) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((item) => ({
      role: item.role,
      content: item.content
    })),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        temperature: 0.8,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('OpenAI request failed:', error.message);
    return null;
  }
}

function generateLocalReply(message, history) {
  const text = message.trim();
  const lower = text.toLowerCase();
  const recent = history.slice(-6).map((entry) => entry.content.toLowerCase()).join(' ');

  const greeting = /(hi|hello|hey|good morning|good afternoon|good evening)/i.test(lower);
  const coding = /(code|debug|bug|javascript|node|react|api|html|css|typescript|python|build|fix)/i.test(lower);
  const planning = /(plan|roadmap|strategy|launch|project|idea|steps)/i.test(lower);
  const writing = /(write|email|message|draft|caption|blog|copy|content)/i.test(lower);
  const business = /(sales|marketing|growth|product|customer|brand|ux|ui|website)/i.test(lower);

  if (greeting) {
    return 'Hello. I’m KALU, your personal AI for the web. I can help you plan, write, code, think clearly, and move faster. What do you want to build or solve today?';
  }

  if (planning) {
    return `Here’s a simple execution plan:

1. Define the outcome in one sentence.
2. Break it into 3–5 concrete milestones.
3. Pick the highest-impact action for today.
4. Ship a small version, test it, and improve.
5. Measure results and adjust.

If you want, I can turn this into a roadmap for your specific idea, product, or project.`;
  }

  if (coding) {
    return `Here’s the practical approach I’d use:

- clarify the goal and expected behavior
- sketch the core flow before coding
- build the smallest working version first
- test the happy path and edge cases
- iterate on clarity, performance, and UX

If you share the feature, bug, or code you’re working on, I can help design the fix or generate a clean implementation.`;
  }

  if (writing) {
    return `A strong draft usually follows this structure:

- clear opening line
- key point or value
- 2–4 supporting details
- a direct call to action or next step

I can help write a draft, tighten the message, or make it more persuasive. Paste your idea and I’ll shape it.`;
  }

  if (business || recent.includes('business') || recent.includes('ux') || recent.includes('website')) {
    return `For a strong web experience, focus on four things:

- clarity: users should know what the product does immediately
- speed: the experience should feel fast and smooth
- trust: good design and transparent interactions build confidence
- conversion: remove friction and make the next step obvious

Optimizing those usually creates a better product than chasing every feature.`;
  }

  return `Here’s the best next move: start with the user’s goal, define the simplest successful outcome, and then remove friction.

For your idea, I’d suggest:
- identify the exact problem
- choose the smallest useful version
- build it in a way users can understand immediately
- test with real usage and refine based on outcomes

If you want, I can help you turn this into a crisp product plan, a technical design, or a high-converting user flow.`;
}

async function handleChat(req, res, body) {
  if (!body || !body.message) {
    sendJson(res, 400, { error: 'A message is required.' });
    return;
  }

  const incoming = String(body.message).trim();
  if (!incoming) {
    sendJson(res, 400, { error: 'Message cannot be empty.' });
    return;
  }

  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];

  let reply = await callOpenAI(incoming, history);
  if (!reply) {
    reply = generateLocalReply(incoming, history);
  }

  sendJson(res, 200, { reply });
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, name: 'KALU', status: 'online' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/chat') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        await handleChat(req, res, parsed);
      } catch (error) {
        sendJson(res, 400, { error: 'Invalid JSON payload.' });
      }
    });
    return;
  }

  const safePath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`KALU is running on http://localhost:${PORT}`);
});
