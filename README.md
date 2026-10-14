# Nexus Trades

An offline-conscious artisan learning app built with React, Tailwind CSS, PixiJS, Express, MongoDB, and Gemini. Authentication uses MongoDB-backed email/password accounts, bcrypt password hashes, and HTTP-only session cookies. Firebase is not used.

## Run locally

1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `GEMINI_API_KEY`. Set `GEMINI_MODEL` to a model available to your account that supports audio input and JSON output.
3. Run `npm run dev`. Open http://localhost:5173.
4. Create an account, select a language, and start a workshop.

MongoDB Atlas or a local MongoDB instance works. The app creates its collections and indexes automatically. The database user needs permission to create indexes. No client-side secrets are required.

## Production

Run `npm run build`, then `npm start`. Express serves the built app and API together on port 3001 (or `PORT`). Serve behind HTTPS; production session cookies require HTTPS. If using a reverse proxy, preserve the request Host header and same-origin routing. Configure proxy-aware rate limiting for your known proxy topology before exposing the service at scale.

## Implemented

- Landing page, signup/login, protected workshop routes, logout.
- Saved language preferences: English, Hausa, Igbo, Ibibio, Yoruba, Swahili, Arabic, French, Nigerian Pidgin, Amharic, Zulu.
- Canonical English workshops and cached Gemini translations stored in MongoDB. User inputs translate to English before generation; display content translates back to the preferred language.
- Select a trade or describe another one. Record up to 60 seconds of microphone input; Gemini transcribes it. Recording requires HTTPS or localhost.
- Guided PixiJS 2D component inspection with accessible HTML component controls, followed by 5–10 questions.
- Server-side scoring, newest-first result cards, saved workshop shelf, translated result review.
- On-device PDF scorecards with logo, learner name, result, completion date, and assessment scope. HTML capture preserves the rendered script rather than relying on PDF Latin fonts.
- App-shell service worker; opened workshops, answers, and translated interface text cached on the device.

## Practical limits

New workshops, translations, transcription, signing in, viewing uncached results, and submitting scores require internet. An existing signed-in browser session can reopen cached workshop content offline, and can reopen the app offline using its cached account identity. Server access always revalidates the session when online. Cached identity grants access only to local content. Scores are stored only after server submission; answers remain locally saved while disconnected. Browser storage can be cleared or evicted.

Generated workshops are educational inspection simulations, not an electrical physics solver or a practical qualification. Content and African-language translations are AI-generated and need expert/native-speaker review before high-stakes use. 3D, local peer-to-peer lesson transfer, offline narration, and supervised certification are outside this first version. No fake scores, seeded accounts, or generated mock lessons are shown.

A learner can complete guided UI steps without demonstrating physical skill. Assessment scoring is server-side, but step completion is client-reported and is not an anti-cheating guarantee.

`npm test` checks scoring, answer-key hiding, translation shape validation, and generated scenario validation. `npm run build` checks the production bundle.
