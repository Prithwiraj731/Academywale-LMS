import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('jwt') || localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        // Store token in localStorage as backup
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', token);
        }
      } else {
        // Clear invalid token
        Cookies.remove('jwt');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('jwt');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        // Store token in localStorage as backup
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        return { success: true, user: data.data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const signup = async (name, email, password, mobile, role = 'user') => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, mobile, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        // Store token in localStorage as backup
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        return { success: true, user: data.data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get('jwt') || localStorage.getItem('token');
      
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear local state regardless of API call success
      Cookies.remove('jwt');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading authentication...
      </div>
    );
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isSignedIn: isAuthenticated, // Legacy compatibility
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
