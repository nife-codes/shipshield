const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5173';

export const api = {
  async analyzeRepo(repoUrl, deploymentUrl) {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl, deploymentUrl })
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  async generatePR(repoUrl, filesToAdd) {
    const response = await fetch(`${API_BASE}/api/pr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl, filesToAdd })
    });

    if (!response.ok) {
      throw new Error(`PR generation failed: ${response.statusText}`);
    }

    return response.json();
  },

  async signIn(email, password) {
    const response = await fetch(`${API_BASE}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Sign in failed: ${response.statusText}`);
    }

    return response.json();
  },

  async signUp(email, password, displayName) {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });

    if (!response.ok) {
      throw new Error(`Sign up failed: ${response.statusText}`);
    }

    return response.json();
  }
};
