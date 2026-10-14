# Nexus Trades — progress and decision log

Read alongside `AGENTS.md` and `README.md`. This log captures material changes and evidence, not a claim that every external integration has been verified.

## Current state

A local React/Express application implements the requested screens and integration paths. MongoDB and Gemini values must be supplied in `.env` before live account and AI flows can be exercised. No Firebase remains in the selected stack.

### File map

| Files | Purpose |
| --- | --- |
| `src/main.jsx` | Landing/auth pages, protected shell, language control, dashboard, practice, assessments, results, PDF export |
| `src/Workshop.jsx` | Lazy-loaded PixiJS 2D workbench and HTML component selection |
| `src/lib.js` | API helpers, language list, translation utility, interface text |
| `src/style.css` | Tailwind entry point, application styling, responsive layouts |
| `server/index.js` | Auth/session API, MongoDB persistence, Gemini generation/translation/transcription, ownership checks, grading endpoints |
| `server/domain.js` | Generated workshop validation, answer-key filtering, grading, translation shape checks |
| `tests/domain.test.js` | Domain checks for grading, invalid submissions, hidden answers, translation shape, component references |
| `public/sw.js`, `public/manifest.webmanifest`, `public/logo.svg` | Offline shell caching, install metadata, logo |
| `package.json`, `package-lock.json`, `vite.config.js`, `index.html` | Dependencies, scripts, build and dev proxy |
| `.env.example`, `.gitignore`, `README.md` | Configuration template, secret exclusions, setup and limitations |

## 2026-10-14 — Initial application implementation

**Request:** Build the landing page, authentication, skill dashboard, language preferences, custom AI workshops, microphone input, assessment, result detail, and PDF scorecards. User subsequently instructed: “Do not use firebase auth.”

**Diff summary:** Created the application from an empty workspace. Added the files listed above and a local ignored `.env` containing empty configuration values. Implemented email/password signup/login/logout, persisted language preference, newest-first scorecards and saved lessons, Gemini-generated inspection scenarios with 5–10 questions, microphone transcription, translated display content, server-side grading, and PDF export. Added responsive orange-and-white styling and an illustrated workshop hero.

**Decisions and constraints:**

- MongoDB replaces the earlier Firebase storage proposal. Firebase Auth was initially requested but explicitly revoked; implemented MongoDB-backed users and sessions with bcrypt password hashing, random opaque session tokens stored as hashes, HTTP-only cookies, and production secure cookies.
- English is canonical. Translate requests into English before generation; translate content on first request for a language and cache the result in MongoDB. Keep IDs, numbers, and option ordering stable.
- Keep Gemini credentials on the Express server. Validate generated workshop structure and hide correct answers before grading.
- Implement the necessary 2D component-inspection workshop in PixiJS. Defer Three.js/3D and physically accurate circuit simulation.
- Scorecards document simulated workshop completion and scores; they do not establish supervised practical competence.
- Use local storage for opened lessons, pending answers, translated interface text, and cached account identity. Use a service worker for shell/assets; online API access always validates the session.
- Upgrade jsPDF from the initial 3.x dependency to `^4.2.1` after installation reported critical advisories.

**Verification recorded in the implementation session:**

- `npm test`: passed the domain test file covering scoring, incomplete/invalid answers, answer-key filtering, translation shape, and scenario references/question counts.
- `npm run build`: passed, including a fresh build after upgrading jsPDF. React Router emitted non-blocking ignored `use client` directive warnings.
- `node --check`: passed for server files and service worker during implementation.
- Dependency installation after the PDF upgrade reported zero known vulnerabilities at that time; this is not a permanent security guarantee.
- Local frontend returned successfully; `/api/health` returned `ok: true` with MongoDB/Gemini configuration flags false.
- Browser accessibility inspection verified the landing page rendered its hero, links, trade cards, feature strip, and explanatory sections. Other screens were not fully exercised in-browser.

**Remaining verification and limitations:**

- Live signup/login, MongoDB writes/ownership isolation, Gemini generation, African-language translation quality, microphone transcription, full assessment flow, and PDF output require configured services and end-to-end testing.
- First-time generation, translation, transcription, sign-in, uncached results, and score submission require connectivity. Offline reading depends on previously cached assets/content and browser storage availability.
- Recorded audio is limited to 60 seconds; microphone use requires HTTPS or localhost and user permission.
- Guided step completion is client-reported, so this is not an anti-cheating or practical qualification system.
- Language output needs native-speaker review; technical educational content needs trade-expert review before high-stakes use.
- Peer-to-peer lesson sharing, 3D, offline narration, and supervised certification are not implemented.
- Configure HTTPS and deployment-specific reverse-proxy/rate-limit settings before production exposure.

## 2026-10-14 — Persistent project guidance and task tracking

**Request:** Create `AGENTS.md` and `PROGRESS.md` to track changes and constraints; update progress after every completed task with diffs, decisions, and new rules.

**Diff summary:** Added root `AGENTS.md` with repository-wide product/security/workflow constraints and mandatory task closeout. Added this `PROGRESS.md` with the current state, file map, initial implementation history, verification evidence, and outstanding limits.

**Decisions:** Use the exact root Markdown filenames requested by the user, rather than adding separate Cursor rules. Separate durable guidance (`AGENTS.md`), evolving history (`PROGRESS.md`), and setup instructions (`README.md`). Retrospective implementation checks above describe prior-session evidence, not checks rerun for this documentation task.

**New rule:** Every completed task, including documentation-only work, must update this log. Record lasting user-established constraints in both this log and `AGENTS.md`; preserve prior entries and never record secrets or unsupported claims.

**Verification:** Read `package.json` and `README.md` and compared the documentation against the implementation history. Checked both new files for existence and required sections. No application code changed; build/tests were not rerun for this documentation-only task.

## 2026-10-14 — Frontend/backend origin validation fix

**Request:** Make the frontend connect properly to the backend; specifically fix “Request origin is not allowed.”

**Diff summary:** Added `server/origin.js` and wired it into Express write-request validation. Added explicit `APP_ORIGIN` configuration to `.env.example` and documented it in `README.md`. Set Vite to port 5173 with `strictPort` so it cannot silently move to an unaccepted origin. Added `tests/origin.test.js` for dev-proxy, production-proxy, spoofed/malformed origin, scheme/port mismatch, and same-origin cases. Existing private `.env` values were not inspected or changed.

**Decision:** Compare full browser origins against an explicit public origin, with localhost/127.0.0.1 port 5173 defaults only in development. Preserve same-origin hosting when no public origin is configured. Do not disable origin validation or trust arbitrary forwarded headers. No cross-origin credentials/CORS changes are needed because the frontend calls relative `/api` endpoints.

**Verification:** `npm test` passed both domain and origin test files. Actual HTTP requests through Vite's `/api` proxy returned 400 for an empty login body with the valid localhost frontend Origin (input validation reached, rather than origin rejection) and 403 for an unrelated Origin. These checks did not create an account or require database/provider credentials. Production build result recorded below.

**New rules:** No new user-established product rules. Configure `APP_ORIGIN` to the exact browser-facing URL for non-default hosts or production deployments and restart the API after environment changes. Credential-dependent full signup/login and AI flows remain unverified by this fix.

**Build:** `npm run build` passed; only the previously observed non-blocking React Router directive warnings appeared.

## 2026-10-14 — Workshop React runtime fix

**Request:** Fix the workshop crash: `Workshop.jsx:3 Uncaught ReferenceError: React is not defined`.

**Diff summary:** Updated `src/Workshop.jsx` to import the default `React` binding alongside `useEffect` and `useRef`.

**Decision:** Keep the existing classic JSX transform and make the component's import consistent with `src/main.jsx`. The compiled JSX calls `React.createElement`, so named hook imports alone do not provide the required React binding. No dependencies or workshop behaviour changed. No new product rules were established.

**Verification:** `npm test` passed both existing test files. A Vite-transformed runtime render using ReactDOM server rendering passed, including component label and selected-state assertions, without the reported ReferenceError. The temporary Vite test server also emitted a sandbox WebSocket binding warning; it closed successfully and did not prevent the render check. This check does not exercise PixiJS/WebGL effects or the authenticated browser workflow.

**Build:** `npm run build` passed, with the existing non-blocking React Router `use client` directive warnings.
