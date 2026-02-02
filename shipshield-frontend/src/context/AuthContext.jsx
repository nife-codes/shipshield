import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shipshield_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('shipshield_token');
    const storedUid = localStorage.getItem('shipshield_uid');

    if (storedToken && storedUid) {
      setUser({ uid: storedUid, email: 'user@example.com' }); // Restore user session
      setToken(storedToken);
    }
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await api.signIn(email, password);
      if (result.token) {
        setToken(result.token);
        setUser({ uid: result.uid, email });
        localStorage.setItem('shipshield_token', result.token);
        localStorage.setItem('shipshield_uid', result.uid);
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
