const express = require('express');
const path = require('path');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

const { CLAUDE_API_KEY, CLAUDE_AGENT_ID, CLAUDE_ENVIRONMENT_ID } = process.env;
if (!CLAUDE_API_KEY || !CLAUDE_AGENT_ID || !CLAUDE_ENVIRONMENT_ID) {
  throw new Error(
    'Missing required env vars. Set CLAUDE_API_KEY, CLAUDE_AGENT_ID, and CLAUDE_ENVIRONMENT_ID in .env',
  );
}

const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/message', async (req, res) => {
  const { input } = req.body;

  try {
    const session = await client.beta.sessions.create({
      agent: CLAUDE_AGENT_ID,
      environment_id: CLAUDE_ENVIRONMENT_ID,
    });

    const stream = await client.beta.sessions.events.stream(session.id);
    await client.beta.sessions.events.send(session.id, {
      events: [
        { type: 'user.message', content: [{ type: 'text', text: input }] },
      ],
    });

    let reply = '';
    for await (const event of stream) {
      if (event.type === 'agent.message') {
        for (const block of event.content) {
          if (block.type === 'text') reply += block.text;
        }
      }
      if (event.type === 'session.status_terminated') break;
      if (
        event.type === 'session.status_idle' &&
        event.stop_reason?.type !== 'requires_action'
      ) {
        break;
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error('Agent invocation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
