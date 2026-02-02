/**
 * Generates file changes based on selected fixes/issues
 * Maps issue types to actual file content that should be added/modified
 */

/**
 * Generate file changes based on selected fixes
 * @param {Array} selectedFixes - Array of fix objects with {id, title, description, fix, severity}
 * @returns {Array} Array of {path, content} objects for PR
 */
export const generateFileChanges = (selectedFixes) => {
  const files = []
  const processedTypes = new Set()

  selectedFixes.forEach(fix => {
    const desc = (fix.description || fix.title || '').toLowerCase()
    const title = (fix.title || '').toLowerCase()

    // Environment Variables
    if ((desc.includes('.env') || desc.includes('environment')) && !processedTypes.has('env')) {
      processedTypes.add('env')
      files.push({
        path: '.env.example',
        content: `# Environment Variables
# Copy this file to .env and fill in your values

# Server Configuration
PORT=3000
NODE_ENV=development

# Database (if applicable)
# DATABASE_URL=your_database_url_here

# API Keys (replace with your actual keys)
# API_KEY=your_api_key_here

# GitHub Token (for repository operations)
# GITHUB_TOKEN=your_github_personal_access_token

# Other Configuration
# Add your project-specific environment variables below
`
      })
    }

    // License
    if ((desc.includes('license') || title.includes('license')) && !processedTypes.has('license')) {
      processedTypes.add('license')
      files.push({
        path: 'LICENSE',
        content: `MIT License

Copyright (c) ${new Date().getFullYear()} [Project Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`
      })
    }

    // README improvements
    if ((desc.includes('readme') || desc.includes('documentation') || title.includes('readme')) && !processedTypes.has('readme')) {
      processedTypes.add('readme')

      files.push({
        path: 'README.md',
        content: `# Project

## Description

${fix.description || 'Add your project description here.'}

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
\`\`\`

### Configuration

Copy the \`.env.example\` file to \`.env\` and update with your values:

\`\`\`bash
cp .env.example .env
\`\`\`

## Usage

### Development

\`\`\`bash
npm run dev
\`\`\`

### Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
project/
├── src/                 # Source files
├── public/              # Static assets
├── tests/               # Test files
├── .env.example         # Environment variables template
└── README.md            # Project documentation
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm test\` - Run tests
- \`npm run lint\` - Run linter

## Testing

\`\`\`bash
npm test
\`\`\`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository.
`
      })

      // Also add CONTRIBUTING.md
      files.push({
        path: 'CONTRIBUTING.md',
        content: `# Contributing Guidelines

Thank thank you for considering contributing to this project!

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: \`git checkout -b feature/your-feature-name\`
3. **Make your changes**
4. **Run tests**: Ensure all tests pass
5. **Commit your changes**: Use clear, descriptive commit messages
6. **Push to your fork**: \`git push origin feature/your-feature-name\`
7. **Open a Pull Request**

## Code Style

- Follow the existing code style
- Add comments for complex logic
- Write meaningful commit messages
- Keep PRs focused on a single feature/fix

## Reporting Issues

- Use the issue tracker
- Provide clear reproduction steps
- Include environment details

## Questions?

Feel free to open an issue for discussion.
`
      })
    }

    // Docker
    if ((desc.includes('docker') || desc.includes('container')) && !processedTypes.has('docker')) {
      processedTypes.add('docker')
      files.push({
        path: 'Dockerfile',
        content: `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
`
      })

      files.push({
        path: 'docker-compose.yml',
        content: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped

  # Add other services as needed (database, redis, etc.)
`
      })
    }

    // .gitignore
    if ((desc.includes('gitignore') || desc.includes('git ignore')) && !processedTypes.has('gitignore')) {
      processedTypes.add('gitignore')
      files.push({
        path: '.gitignore',
        content: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local

# Build output
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log

# Temporary files
tmp/
temp/
`
      })
    }

    // CI/CD
    if ((desc.includes('ci') || desc.includes('github actions') || desc.includes('continuous integration')) && !processedTypes.has('ci')) {
      processedTypes.add('ci')
      files.push({
        path: '.github/workflows/ci.yml',
        content: `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
`
      })
    }

    // Testing - add test examples
    if ((desc.includes('no test script') || desc.includes('no test files') || (desc.includes('test') && title.includes('test'))) && !processedTypes.has('test')) {
      processedTypes.add('test')
      files.push({
        path: 'tests/example.test.js',
        content: `// Example test file
// Install testing framework: npm install --save-dev jest

describe('Example Test Suite', () => {
  test('should add two numbers correctly', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  test('should handle edge cases', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});

// Add this to package.json scripts:
// "test": "jest"
// "test:watch": "jest --watch"
// "test:coverage": "jest --coverage"
`
      })
    }

    // Linting - add ESLint config
    if ((desc.includes('no linting') || desc.includes('no eslint') || desc.includes('eslint')) && !processedTypes.has('eslint')) {
      processedTypes.add('eslint')
      files.push({
        path: '.eslintrc.json',
        content: `{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
`
      })
    }

    // TypeScript config
    if ((desc.includes('typescript not in strict mode') || (desc.includes('typescript') && !processedTypes.has('typescript'))) && !processedTypes.has('typescript')) {
      processedTypes.add('typescript')
      files.push({
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
`
      })
    }

    // Security - package.json script suggestions
    if ((desc.includes('security') || desc.includes('vulnerability')) && !processedTypes.has('security')) {
      processedTypes.add('security')
      files.push({
        path: 'SECURITY.md',
        content: `# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow reasonable time for a fix before public disclosure

We will acknowledge your email within 48 hours and provide a timeline for a fix.

## Security Best Practices

- Keep dependencies up to date
- Run \`npm audit\` regularly
- Use environment variables for sensitive data
- Never commit secrets to the repository
`
      })
    }
  })

  // If no files generated, provide at least a basic improvement
  if (files.length === 0) {
    files.push({
      path: '.env.example',
      content: `# Environment Variables
PORT=3000
NODE_ENV=development
`
    })
  }

  return files
}
