# Nexus Trades — project guidance

Applies to the entire repository. Read this file and `PROGRESS.md` before starting work.

## Required task closeout

- After completing every task, update `PROGRESS.md` in the same change set, including documentation-only tasks.
- Record the date, request, files changed and meaningful diff summary, decisions, verification results, limitations, and any new rules agreed with the user.
- Preserve prior entries. Distinguish implemented features, proposals, and unverified behaviour; never invent test results.
- When the user establishes a lasting constraint, update this file as well as recording it in `PROGRESS.md`.
- Do not include credentials, private connection strings, session tokens, or personal data in either file.

## Product constraints agreed with the user

- Build only what is necessary: a practical artisan learning platform for minimal internet use.
- Use MongoDB for structured persistence. Do not use Firebase, including Firebase Auth; the user's later instruction supersedes the initial Firebase request.
- Use email/password authentication. The current implementation uses bcrypt and server-validated, HTTP-only cookie sessions backed by MongoDB.
- Protect skill pages, simulations, results, and user API records. Scope database access to the authenticated user; never trust a client-supplied user ID.
- Use Tailwind CSS with a clean, modern white interface, subtle card shadows, and orange accents; keep layouts responsive and controls accessible.
- Provide landing/signup/login, skill dashboard, scenario practice, and simulation detail/scorecard screens.
- Dashboard shows the user's simulation scores newest first, saved content, a practice action, and a persistent language-preference control.
- Save language preferences in MongoDB and use them for learning content and scorecards. African languages, including Hausa, Igbo, and Ibibio, are essential.
- Keep English as canonical lesson content. Translate learner inputs to English and content back to their selected language; cache translations by source content/version and language for reuse and offline downloading.
- Use Gemini for workshop generation, translation, and recorded speech transcription. Allow a listed trade or a custom practice request.
- Each generated workshop includes 5–10 multiple-choice questions and grading on submission.
- Generate downloadable PDF completion scorecards with the app logo, subject, learner, and results in the selected language. Describe completion of a simulation, not an independently verified practical qualification.
- Provide environment-variable templates; the user supplies credentials. Keep provider credentials exclusively on the server.

## Implementation boundaries and working conventions

- Current stack: React/Vite, Tailwind, Express, MongoDB, Gemini, PixiJS, html2canvas/jsPDF. See `README.md` for commands and setup.
- PixiJS implements the current 2D inspection workshop. Three.js was proposed for later 3D; it is not installed or implemented. Do not claim otherwise.
- Separate simulation/assessment rules from rendering and translation. Keep answer keys server-side until submission; compute scores on the server.
- Validate generated schemas and component references. Translation must preserve structure, IDs, numerical values, option order, and scoring semantics. Treat learner inputs and model output as untrusted data.
- Preserve offline-conscious caching. Clearly disclose actions requiring connectivity; do not claim full offline generation, authentication, transcription, or submission.
- Do not add fabricated scores, accounts, lessons, or integrations to make an unconfigured app appear connected.
- Keep `.env` ignored and `.env.example` current. Never print secrets while debugging.
- Run checks appropriate to the changes. For application changes, use `npm test` and `npm run build`; record credential-dependent flows as unverified unless actually exercised.
- Do not broaden scope to 3D, peer sharing, narration, or supervised certification without a new task. These remain future possibilities.
