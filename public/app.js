const form = document.getElementById('message-form');
const input = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const btnLabel = submitBtn.querySelector('.btn-label');
const responseArea = document.getElementById('response-area');

const LOADING_LINES = [
  'Warming up the mic',
  'Sharpening the punchline',
  'Consulting the writers room',
  'Loading the cannons',
  'Looking for the easiest target',
];

function setState(cls, html) {
  responseArea.classList.remove('empty', 'loading', 'error');
  if (cls) responseArea.classList.add(cls);
  responseArea.innerHTML = html;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  submitBtn.disabled = true;
  btnLabel.textContent = 'Cooking...';
  const line = LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];
  setState('loading', `${line}<span class="dots"></span>`);

  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: value }),
    });

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const data = await res.json();
    const reply = (data.reply ?? '').trim();
    if (!reply) {
      setState('error', 'The roast machine is speechless. Try again.');
    } else {
      setState(null, escapeHtml(reply));
    }
  } catch (err) {
    setState('error', `The roast misfired: ${escapeHtml(err.message)}`);
  } finally {
    submitBtn.disabled = false;
    btnLabel.textContent = 'Roast me';
  }
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
