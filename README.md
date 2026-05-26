# Abhijit — NextGen Portfolio

> A modern interactive developer portfolio showcasing projects, skills, and a live AI assistant.

## Overview

This repository contains the source for a personal portfolio website built with a modern frontend toolchain. It features interactive visual components, a terminal-like project showcase, and integrations for deploying the site to edge platforms.

## Live Demo

Add your demo URL here (if hosted).

## Tech Stack

- Framework: React / Preact (via Vite)
- Bundler: Vite
- Tooling: Bun / Node.js, ESLint, TypeScript
- Deployment: Cloudflare Workers / Pages (configured via `wrangler.jsonc`)

## Features

- Animated, interactive project and skill visualizations
- AI assistant component
- Mobile-aware layout and accessibility-minded UI primitives
- Reusable component library under `src/components/ui`

## Getting Started

Prerequisites:

- Node.js (recommended LTS)
- A package manager (npm, pnpm or yarn)

Install dependencies:

```bash
cd client
npm install
```

Run the development server:

```bash
npm run dev --prefix client
```

Build for production:

```bash
npm run build --prefix client
```

Preview the production build:

```bash
npm run preview --prefix client
```

Check `client/package.json` for exact script names and additional commands.

## Project Structure

- `client/` — front-end source and configuration
  - `src/components` — React components used across the site
  - `src/lib` — utilities and data (portfolio entries, helpers)
  - `wrangler.jsonc` — Cloudflare Workers configuration (if deploying to Cloudflare)

## Deployment

This project can be deployed to platforms that support static and edge deployments. See `wrangler.jsonc` to deploy with Cloudflare Workers or Pages. For other hosts, build the `client` folder and serve the `dist` output.

## Contributing

Contributions, issues, and feature requests are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-change`
3. Commit changes and open a pull request

## License

Include your preferred license here (e.g., MIT). If unsure, add a `LICENSE` file.

## Contact

For questions or collaboration, contact Abhijit.
