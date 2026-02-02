# ShipShield Frontend

A React application built with Vite for ShipShield, featuring routing and various UI components.

## Project Structure

```
shipshield-frontend/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
├── public/
│   └── vite.svg
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── animations/
    │   └── FadeIn.jsx
    ├── assets/
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   ├── PageShell.jsx
    │   │   └── Sidebar.jsx
    │   ├── score/
    │   │   ├── ScoreCard.jsx
    │   │   └── ShipScoreGauge.jsx
    │   └── ui/
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       └── Card.jsx
    └── Pages/
        ├── Dashboard.jsx
        ├── FixPR.jsx
        ├── Issues.jsx
        ├── Landing.jsx
        ├── Scan.jsx
        └── Success.jsx
```

## Key Imports and Dependencies

### Main Application (App.jsx)
- `BrowserRouter as Router, Routes, Route` from 'react-router-dom' - For client-side routing
- Page components: Landing, Scan, FixPR, Issues, Dashboard, Success from './Pages/'

### Package Dependencies
- **React**: ^19.2.0 - Core React library
- **React DOM**: ^19.2.0 - React rendering for web
- **React Router DOM**: ^7.12.0 - Declarative routing for React
- **Framer Motion**: ^12.27.5 - Animation library
- **Tailwind CSS**: ^4.1.18 - Utility-first CSS framework
- **Recharts**: ^3.6.0 - Chart library for React
- **clsx**: ^2.1.1 - Utility for constructing className strings conditionally
- **tailwind-merge**: ^3.4.0 - Utility for merging Tailwind CSS classes

### Component Imports
- UI components (Button, Card, Badge) from './components/ui/'
- Layout components (Navbar, Sidebar, PageShell) from './components/layout/'
- Score components (ShipScoreGauge, ScoreCard) from './components/score/'
- Animation components (FadeIn) from './animations/'

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## Routing

The application uses React Router with the following routes:
- `/` - Landing page
- `/scan` - Scan page
- `/fixpr` - Fix PR page
- `/issues` - Issues page
- `/dashboard` - Dashboard page
- `/success` - Success page
