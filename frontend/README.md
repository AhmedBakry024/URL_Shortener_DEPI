# Quote Generator Frontend

A professional single-page application that consumes the Quote Generator Service API.

> The root `docker-compose.yml` builds and serves this UI automatically on <http://localhost:8080>.

## Tech Stack

- React 18 with functional components
- Vite 5 for blazing-fast dev and builds
- Modern CSS with a lightweight design system

## Getting Started

```bash
npm install
npm run dev
```

The development server runs on <http://localhost:5173> and proxies API calls to <http://localhost:3000> by default.

To target a different backend, create `.env.local` with:

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

## Production Build

```bash
npm run build
npm run preview
```

The compiled assets output to `frontend/dist`. Serve them behind your preferred static host or CDN.

## Project Layout

```text
frontend/
├── src/
│   ├── App.jsx            # Application shell and state orchestration
│   ├── components/        # Headline UI pieces (cards, forms, grids)
│   ├── services/api.js    # API client abstraction
│   ├── styles/            # Layout and utility stylesheets
│   └── main.jsx           # Entry point wiring React + DOM
├── index.html             # HTML entry document
└── vite.config.js         # Vite configuration with backend proxy
```

## Quality Bar

- Typed PropTypes on components
- Graceful loading states and error messaging
- Responsive layout scaling down to tablets
- Auto-refresh on metrics with manual refresh controls
