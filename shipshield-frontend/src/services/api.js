const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getHeaders = () => {
  const token = localStorage.getItem('shipshield_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async analyzeRepo(repoUrl, deploymentUrl) {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ repoUrl, deploymentUrl })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  async getLatestRepo() {
    const history = await this.getHistory();
    return history && history.length > 0 ? history[0] : null;
  },

  async getHistory() {
    const response = await fetch(`${API_BASE}/api/history`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `History fetch failed: ${response.statusText}`);
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
  },

  // NEW DEMO USER FUNCTION
  async demoSignIn() {
    const response = await fetch(`${API_BASE}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'demo@shipshield.com', 
        password: 'password' 
      })
    });

    if (!response.ok) {
      throw new Error(`Demo sign in failed: ${response.statusText}`);
    }

    return response.json();
  }
};