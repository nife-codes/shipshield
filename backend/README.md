# ShipShield Backend

Backend API for ShipShield - analyzes GitHub repositories for production readiness and generates fix PRs.

🔗**[LIVE BACKEND](https://shipshield-backend.vercel.app/)**

## Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub Personal Access Token

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the backend root:
```bash
cp .env.example .env
```

3. Add your GitHub token to `.env`:
```
PORT=3001
GITHUB_TOKEN=your_github_personal_access_token
```

To get a GitHub token:
- Go to https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select scope: `repo` (full control of repositories)
- Copy the token and paste in `.env`

## Running Locally

Development mode (auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "ShipShield API is running"
}
```

### Analyze Repository
```
POST /api/analyze
```

Request body:
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "deploymentUrl": "https://example.com" // optional
}
```

Response:
```json
{
  "score": 67,
  "categories": {
    "deploymentReality": {
      "score": 0,
      "issues": []
    },
    "repoCredibility": {
      "score": 20,
      "issues": ["Single contributor"]
    },
    "productionSafety": {
      "score": 22,
      "issues": ["No LICENSE file"]
    },
    "developerExperience": {
      "score": 25,
      "issues": []
    }
  },
  "topIssues": [
    "Single contributor",
    "No LICENSE file"
  ],
  "repoUrl": "https://github.com/owner/repo",
  "analysisId": "1234567890"
}
```

## Scoring Categories

**Deployment Reality (25 points)**
- Cold start performance
- HTTPS & security headers
- Console errors
- Response time

**Repo Credibility (25 points)**
- Commit patterns
- Contributor diversity
- README quality

**Production Safety (25 points)**
- LICENSE file
- .env.example presence
- Secret detection
- .gitignore

**Developer Experience (25 points)**
- Setup complexity
- Helper scripts
- CONTRIBUTING.md
- Documentation quality

## Project Structure
```
backend/
├── src/
│   ├── server.js           # Express app entry point
│   ├── routes/             # API route handlers
│   ├── services/
│   │   ├── github.js       # GitHub API integration
│   │   ├── scoring.js      # Scoring algorithm
│   │   ├── deployment.js   # Deployment checks
│   │   └── pr-generator.js # PR generation logic
│   └── utils/
│       └── secrets.js      # Secret scanning patterns
├── package.json
├── .env.example
└── README.md
```

## Testing

Test the API with curl:
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/nife-codes/shipshield"}'
```

Or use PowerShell:
```powershell
$body = @{ repoUrl = "https://github.com/nife-codes/shipshield" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/analyze" -Method Post -Body $body -ContentType "application/json"
```

## Deployment

Backend is deployed on Vercel as serverless functions.

Environment variables required:
- `GITHUB_TOKEN`

## Team

- Nife: Scoring engine, GitHub API
- Israel: Deployment checks, PR generation, database

## License

MIT
