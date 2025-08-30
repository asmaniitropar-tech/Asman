import { useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser, login as authLogin, signup as authSignup, logout as authLogout } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authLogin(email, password);
    setUser(user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const user = await authSignup(email, password, name);
    setUser(user);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    signup,
    logout
  };
};