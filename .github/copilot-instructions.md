# Project instructions

## What this project is

ELMO is a static subject-based practice site. Its active subject, Lengua, has four independent exercises:

- `adjetivos/` — adjective forms and degrees
- `palabras-invariables/` — invariable word categories
- `sustantivos/` — nouns
- `determinantes/` — determiners

## Architecture and conventions

- The site uses plain HTML, CSS, and browser JavaScript. There is no package manager, build step, or framework.
- Each exercise directory contains its own `index.html`, `styles.css`, `datos.js`, and `app.js`. Keep exercise-specific behavior and styles in that directory.
- Each exercise page loads `datos.js` before `app.js`. The data file exposes its data on `window` (for example, `ADJ_FRASES`, `FRASES_RAW`, `SUST_NOMBRES`, or `DET_FRASES`); preserve the names and data shapes expected by the corresponding app.
- The root `index.html` is the subject selector; `lengua/index.html` lists the Lengua exercises. Exercise pages link back to the Lengua catalog, which links back to the subject selector. Keep these routes and their relative links in sync.
- Only Lengua is currently available. Show unavailable subjects as clearly labeled, visually muted native disabled controls rather than active links.
- Subject colors are Social red, Naturales green, Lingua Galega purple, Inglés orange, Matemáticas blue, and Lengua yellow. Keep each subject's main theme recognizable; exercise cards within a subject may use distinct colors.
- User-facing content is in Spanish. Preserve the existing Spanish terminology, tone, and spelling.
- Exercise progress and records are stored in browser `localStorage`; preserve existing keys when changing persistence behavior.
- Keep usage data local to the browser. Do not add cookies, analytics, accounts, or remote transmission of usage data without an explicit decision. Existing pages load fonts from Google Fonts.
- Keep the UI responsive and maintain the existing keyboard-accessible native HTML controls.

## Validation

- There are no configured build, lint, or test commands.
- For JavaScript changes, check syntax with `node --check path/to/file.js`.
- For UI changes, serve the repository root with a local static HTTP server and check the affected page at desktop and mobile widths, including keyboard navigation and horizontal overflow. The pages rely on relative asset paths.
