import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Validate token or set user from token
      setUser({ uid: 'user123' }); // Mock for now
    }
  }, [token]);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await api.signIn(email, password);
      if (result.token) {
        setToken(result.token);
        setUser({ uid: result.uid });
        localStorage.setItem('token', result.token);
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      const result = await api.signUp(email, password, displayName);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
