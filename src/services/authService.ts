import { User } from '../types';

// Mock authentication service
// In production, you'd integrate with Supabase Auth or Firebase Auth

let currentUser: User | null = null;

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email && password) {
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
    currentUser = user;
    localStorage.setItem('asman_user', JSON.stringify(user));
    return user;
  }
  
  throw new Error('Invalid credentials');
};

export const signup = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user: User = {
    id: Date.now().toString(),
    email,
    name
  };
  
  currentUser = user;
  localStorage.setItem('asman_user', JSON.stringify(user));
  return user;
};

export const logout = async (): Promise<void> => {
  currentUser = null;
  localStorage.removeItem('asman_user');
};

export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  const stored = localStorage.getItem('asman_user');
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  
  return null;
};