import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mscollection_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mscollection_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mscollection_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser({ ...data.user, token: data.token });
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser({ ...data.user, token: data.token });
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mscollection_user');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser({ ...data.user, token: data.token || user.token });
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Profile update failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
