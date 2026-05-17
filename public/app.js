const form = document.getElementById('message-form');
const input = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const responseArea = document.getElementById('response-area');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  submitBtn.disabled = true;
  responseArea.textContent = 'Loading...';

  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: value }),
    });

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const data = await res.json();
    responseArea.textContent = data.reply;
  } catch (err) {
    responseArea.textContent = `Error: ${err.message}`;
  } finally {
    submitBtn.disabled = false;
  }
});
