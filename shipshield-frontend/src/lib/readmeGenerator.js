/**
 * Generates a comprehensive README.md based on repository analysis
 * @param {Object} repoData - Repository data including package.json, files, etc.
 * @returns {string} Generated README content
 */
export const generateREADME = (repoData) => {
    const packageJson = repoData.packageJson || {};
    const repoName = repoData.name || 'Project';
    const description = repoData.description || packageJson.description || 'A software project';
    const files = repoData.files || [];

    // Detect project type
    const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
    const isReact = deps['react'] || files.some(f => f.includes('jsx'));
    const isVue = deps['vue'];
    const isAngular = deps['@angular/core'];
    const isNext = deps['next'];
    const isExpress = deps['express'];
    const isNest = deps['@nestjs/core'];
    const isVite = deps['vite'];
    const hasTypeScript = deps['typescript'] || files.some(f => f.endsWith('.ts') || f.endsWith('.tsx'));
    const hasTailwind = deps['tailwindcss'];
    const hasDocker = files.some(f => f === 'Dockerfile' || f === 'docker-compose.yml');

    // Determine primary framework
    let framework = 'Node.js';
    if (isNext) framework = 'Next.js';
    else if (isReact) framework = 'React';
    else if (isVue) framework = 'Vue.js';
    else if (isAngular) framework = 'Angular';
    else if (isNest) framework = 'NestJS';
    else if (isExpress) framework = 'Express';

    // Build tech stack
    const techStack = [];
    techStack.push(`**Core**: ${framework}`);
    if (isVite) techStack.push('**Build Tool**: Vite');
    if (hasTypeScript) techStack.push('**Language**: TypeScript');
    if (hasTailwind) techStack.push('**Styling**: Tailwind CSS');

    // Detect testing framework
    if (deps['jest']) techStack.push('**Testing**: Jest');
    else if (deps['vitest']) techStack.push('**Testing**: Vitest');
    else if (deps['mocha']) techStack.push('**Testing**: Mocha');

    // Detect state management
    if (deps['redux'] || deps['@reduxjs/toolkit']) techStack.push('**State**: Redux');
    else if (deps['zustand']) techStack.push('**State**: Zustand');
    else if (deps['mobx']) techStack.push('**State**: MobX');

    // Get scripts
    const scripts = packageJson.scripts || {};
    const hasStart = scripts.start || scripts.dev;
    const hasBuild = scripts.build;
    const hasTest = scripts.test;

    // Get node version if specified
    const nodeVersion = packageJson.engines?.node || '18.x';

    return `# ${repoName}

${description}

## 🚀 Tech Stack

${techStack.join('\n')}

## 📋 Prerequisites

- Node.js ${nodeVersion} or higher
- npm or yarn package manager${hasDocker ? '\n- Docker (optional)' : ''}

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ${repoName.toLowerCase().replace(/\s+/g, '-')}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

## 🚦 Running the Application

${hasStart ? `### Development Mode
\`\`\`bash
${scripts.dev ? 'npm run dev' : 'npm start'}
\`\`\`
${isReact || isNext || isVite ? '\nThe application will be available at `http://localhost:3000` (or the port specified in your .env file).' : ''}
` : ''}
${hasBuild ? `### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`
` : ''}
${hasDocker ? `### Using Docker
\`\`\`bash
docker-compose up
\`\`\`
` : ''}

## 📜 Available Scripts

${Object.entries(scripts).map(([name, command]) => `- \`npm run ${name}\` - ${getScriptDescription(name)}`).join('\n')}

${hasTest ? `## 🧪 Running Tests

\`\`\`bash
npm test
\`\`\`

${scripts['test:coverage'] ? `For coverage report:
\`\`\`bash
npm run test:coverage
\`\`\`
` : ''}` : ''}

## 📁 Project Structure

\`\`\`
${repoName}/
├── src/                 # Source files
${isReact || isVue || isAngular ? '├── public/              # Static assets' : ''}
${hasDocker ? '├── Dockerfile           # Docker configuration' : ''}
├── package.json         # Dependencies and scripts
${hasTypeScript ? '├── tsconfig.json        # TypeScript configuration' : ''}
└── README.md            # Project documentation
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

${packageJson.license || 'This project is licensed under the MIT License.'}

## 👥 Authors

${packageJson.author ? `- ${packageJson.author}` : '- Your Name'}

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
${isReact ? '- Built with React' : ''}
${isNext ? '- Powered by Next.js' : ''}
${isVite ? '- Built with Vite' : ''}
`;
};

/**
 * Helper function to describe common npm scripts
 */
const getScriptDescription = (scriptName) => {
    const descriptions = {
        'dev': 'Start development server',
        'start': 'Start the application',
        'build': 'Build for production',
        'test': 'Run test suite',
        'lint': 'Run linter',
        'format': 'Format code',
        'preview': 'Preview production build',
        'deploy': 'Deploy application',
        'clean': 'Clean build artifacts',
        'typecheck': 'Check TypeScript types',
        'test:coverage': 'Run tests with coverage',
        'test:watch': 'Run tests in watch mode',
        'storybook': 'Start Storybook',
        'prepare': 'Prepare hooks (Husky)',
    };
    return descriptions[scriptName] || 'Custom script';
};
