# ShipShield

Ship-readiness checker for GitHub projects. Analyzes deployment health, security, docs, and developer experience. Outputs a Ship Score (0-100) and auto-generates PRs with fixes.

**🔗 [Live Demo](https:) | [LIVE BACKEND](https://shipshield-seven.vercel.app/)**


## How It Works

1. Paste a GitHub repo URL
2. ShipShield scans the repo across 4 categories
3. Get a Ship Score (0-100) with specific issues flagged
4. Auto-generate a PR that fixes the problems

## Scoring Categories

- **Deployment Reality (25 pts)** - Response time, HTTPS, console errors
- **Repo Credibility (25 pts)** - Commit patterns, contributors, README quality
- **Production Safety (25 pts)** - Secrets, LICENSE, .env.example, .gitignore
- **Developer Experience (25 pts)** - Setup complexity, documentation, helper scripts

## Tech Stack

- Frontend: React + Tailwind
- Backend: Node.js + Express
- APIs: GitHub (Octokit), Puppeteer
- Database: Firebase (Firestore)
- Hosting: Vercel

## Live App

- Frontend: (coming soon)
- Backend API: https://shipshield-seven.vercel.app

## Local Setup

See [backend/README.md](backend/README.md) for backend setup.
See [frontend/README.md](frontend/README.md) for frontend setup.

## Team

- Nife: Backend - scoring engine, GitHub API
- Israel: Backend - PR generation, deployment checks, Firebase
- Idris: Frontend lead - dashboard, UI/UX
- Ife: Frontend - visualization, animations

## License

MIT
