import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return setLoading(false);
    api
      .get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => { localStorage.removeItem('token'); sessionStorage.removeItem('token'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember = false) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (remember) localStorage.setItem('token', data.token);
    else sessionStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
