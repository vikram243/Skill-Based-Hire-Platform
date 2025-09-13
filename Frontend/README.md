
  # Skill‑Based Hire Platform

  A small frontend prototype for a marketplace where users can browse and hire skill providers. Built with Vite + React and a set of UI primitives/components located under `src/ui`.

  ## Key features

  - Landing / Home feed for browsing skills
  - Skill cards and skill detail pages
  - Provider onboarding (register as provider)
  - Basic navigation and profile pages
  - Pages for orders, history, cart and a simple hire flow
  - Reusable UI primitives under `src/ui` (buttons, dialogs, inputs, cards, etc.)

  ## Tech stack

  - React (JSX) with Vite
  - Plain CSS modules / global styles in `src/styles`
  - Project organized as a single-page frontend app (no backend included in this repository)

  ## Prerequisites

  - Node.js (LTS recommended, e.g. 14/16/18+)
  - npm (or yarn/pnpm if you prefer; examples below use npm)

  ## Getting started

  Clone the repository then install dependencies and run the dev server:

  ```powershell
  npm install
  npm run dev
  ```

  The Vite dev server typically serves the app at http://localhost:5173 — check the terminal output after `npm run dev`.

  If a production build is available in `package.json`, you can build with:

  ```powershell
  npm run build
  ```

  ## Project structure (important files)

  - `index.html` — Vite entry
  - `vite.config.js` — Vite config
  - `src/main.jsx` — app bootstrap
  - `src/App.jsx` — top-level routes / layout
  - `src/index.css` and `src/styles/globals.css` — global styles
  - `src/components/` — main pages and feature components
    - `LandingPage.jsx`, `HomeFeed.jsx`, `SkillDetailPage.jsx`, `HireFlow.jsx`, `RegisterProviderPage.jsx`, etc.
  - `src/components/ui/` — collection of UI primitives used across the app (buttons, dialogs, inputs, cards)
  - `src/data/mockData.js` — sample/mock data used by the UI
  - `src/guidelines/Guidelines.md` — design content / guidelines used in the project

  ## Components overview

  - AuthPage, RegisterProviderPage — authentication / provider onboarding flows
  - HomeFeed, LandingPage — discovery and landing screens
  - SkillCard, SkillDetailPage — browse skills and view details
  - HireFlow — multi-step UI for hiring a provider
  - ProfilePage, OrdersPage, HistoryPage — user account areas

  UI primitives in `src/components/ui` are implemented as small, reusable components (card, button, dialog, input, avatar, table, etc.). These make it straightforward to build new pages by composing primitives.

  ## Data & mockups

  - `src/data/mockData.js` contains mocked skill and provider data the app consumes in dev mode.
  - `src/components/figma/ImageWithFallback.jsx` provides an image component with a fallback to improve robustness when an image fails to load.

  ## Development notes

  - The repo is a frontend-only codebase. There is no server included — API integration is expected to be added later.
  - The project appears set up for local development with Vite; ensure Node/npm are installed and the `package.json` scripts are available.

  ## Contributing

  If you'd like to contribute:

  1. Fork the repo and create a feature branch.
  2. Install dependencies and run the dev server.
  3. Add tests or a preview where applicable and open a pull request describing your changes.

  Small suggestions you could add next:

  - Add a README screenshot or GIF under `docs/` to show the UI
  - Add a `package.json` script for linting and testing (if not present)
  - Wire a simple mock API (json-server) or add environment doc for backend integration

  ## License

  Specify a license in the repo root (e.g., `LICENSE` file). If you don't have one, add one — MIT is a common choice for prototype projects.

  ## Contact

  For questions about this project, open an issue in the repository or contact the project owner listed in the repo metadata.

  ---

  README generated from the project layout in `src/` and top-level files. If you want I can:

  - Add screenshots or a short demo GIF
  - Extract available npm scripts from `package.json` and list them in this README
  - Add a CONTRIBUTING.md and CODE_OF_CONDUCT

  