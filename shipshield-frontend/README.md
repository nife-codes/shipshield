# ShipShield Frontend

**🔗 [LIVE DEMO](https://shipshield-othb.vercel.app)**

A modern, high-performance React application built for ShipShield, leveraging Vite, Tailwind CSS v4, and React 19. This dashboard provides users with real-time insights, scanning capabilities, and issue management for their repositories.

## Tech Stack

- **Core**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` plugin)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: React Context (`AuthContext`)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: `jspdf` & `jspdf-autotable`

## Project Structure

```
shipshield-frontend/
├── src/
│   ├── animations/     # Reusable animation components (e.g., FadeIn)
│   ├── assets/         # Static assets like images and global styles
│   ├── components/     # UI Building Blocks
│   │   ├── Auth/       # Signin/Signup forms
│   │   ├── layout/     # Navbar, Sidebar, PageShell
│   │   ├── score/      # specialized score visualization components
│   │   └── ui/         # Generic UI kit (Button, Card, Badge)
│   ├── context/        # React Context providers (AuthContext)
│   ├── lib/            # Utility functions and helpers
│   │   ├── api.js      # API interaction layer
│   │   ├── format.js   # Data formatting utilities
│   │   ├── scoring.js  # Score calculation logic
│   │   └── ...
│   ├── Pages/          # Main route components (Dashboard, Issues, Scan, etc.)
│   ├── services/       # External service integrations
│   ├── App.jsx         # Main application entry & routing setup
│   └── index.css       # Global styles & Tailwind imports
├── public/             # Static public assets
├── eslint.config.js    # ESLint configuration
├── vite.config.js      # Vite configuration including Tailwind plugin
└── package.json        # Dependencies and scripts
```

## Setup & Installation

Follow these steps to get the project running locally.

### Prerequisites
- Node.js (Latest LTS recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shipshield-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app should now be running at `http://localhost:5173` (or the port shown in your terminal).

## Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the application for production to the `dist` folder. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## 🎨 Styling & Configuration

### Tailwind CSS v4
This project uses the latest Tailwind CSS v4. Configuration is handled primarily through CSS variables and the `@tailwindcss/vite` plugin in `vite.config.js`. You won't find a traditional `tailwind.config.js` file as v4 defaults to zero-configuration.

### Utility Class Management
We use `clsx` and `tailwind-merge` (often abstracted in `lib/utils.js` or directly used) to dynamically construct efficient and conflict-free class strings for components.

## Key Features

### Core Functionality
- **Authentication**: Secure Sign-in/Sign-up flow with demo user option
- **Dashboard**: High-level metrics with visual score gauges and real-time repository analysis
- **Repository Scanning**: GitHub repository analysis with comprehensive security, quality, and best practice checks
- **Issues Management**: Detailed issue breakdown with expandable fix suggestions
- **PR Generation**: Automated pull request creation with selected fixes

### Enhanced Scanning System (v2.0)
The application now provides 5-10x more insights with advanced analysis:

**Backend Analysis:**
- Package.json deep analysis (dependencies, scripts, testing frameworks)
- TypeScript configuration checking (strict mode detection)
- Code quality metrics (test file ratio, TS adoption %)
- ESLint configuration verification
- 6 analysis categories (vs 4 previously)

**Frontend Enhancements:**
- Smart fix suggestions with specific commands
- Contextual recommendations based on issue type
- Real file generation for PRs (test files, configs, documentation)

### Fix Generation Features
- **Smart README Generator**: Analyzes project type and generates comprehensive documentation
- **Configuration Files**: Automatically creates `.eslintrc.json`, `tsconfig.json`, test examples
- **Security Files**: Generates `SECURITY.md`, `.gitignore`, `.env.example`
- **CI/CD Setup**: Creates GitHub Actions workflows
- **Docker Support**: Generates Dockerfile and docker-compose.yml

### PR Management
- Intelligent file conflict resolution (checks for existing files before updating)
- Bulk fix selection with visual feedback
- Detailed PR descriptions with file listings
- Support for both new file creation and existing file updates
eports to CSV/PDF (via `lib/export.js`).
