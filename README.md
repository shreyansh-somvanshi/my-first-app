# my-first-app

A minimal web app with an HTML/CSS/JS frontend and a Node.js + Express backend.

## Structure

```
my-first-app/
├── public/
│   ├── index.html   # UI: input, submit button, response area
│   ├── styles.css
│   └── app.js       # Sends input to /api/message
├── server.js        # Express server + /api/message endpoint
├── package.json
└── .gitignore
```

## Setup

```bash
cd ~/Desktop/my-first-app
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## Connecting a real API later

The `POST /api/message` handler in `server.js` currently echoes the input. Replace the stub with a `fetch` call to your target API (OpenAI, Anthropic, weather API, etc.). Put any secret keys in a `.env` file (already gitignored).
