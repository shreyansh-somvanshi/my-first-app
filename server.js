const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/message', async (req, res) => {
  const { input } = req.body;

  // TODO: Replace this stub with a real API call (e.g., fetch to an external service).
  const reply = `You sent: "${input}". (Hook up a real API here.)`;

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
