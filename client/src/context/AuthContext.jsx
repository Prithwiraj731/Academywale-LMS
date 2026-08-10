import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

import { API_URL } from '../api';

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
        return { success: false, message: data.message, code: data.code, email: data.email };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const signup = async (name, email, password, mobile, role = 'user') => {
    console.log('AuthContext signup called with:', { name, email, password: '[HIDDEN]', mobile, role });
    console.log('API_URL:', API_URL);
    
    try {
      const requestBody = { name, email, password, mobile, role };
      console.log('Sending signup request to:', `${API_URL}/api/auth/signup`);
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Signup response status:', response.status);
      const data = await response.json();
      console.log('Signup response data:', data);

      if (response.ok) {
        return { success: true, message: data.message, email: data.email, mobile: data.mobile };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const verifyOTP = async (emailOrMobile, otp, extraParams = {}) => {
    try {
      const payload = {
        otp,
        email: typeof emailOrMobile === 'string' && emailOrMobile.includes('@') ? emailOrMobile : extraParams.email,
        mobile: typeof emailOrMobile === 'string' && !emailOrMobile.includes('@') ? emailOrMobile : extraParams.mobile
      };

      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        return { success: true, user: data.data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Verify OTP failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const resendOTP = async (emailOrMobile, extraParams = {}) => {
    try {
      const payload = {
        email: typeof emailOrMobile === 'string' && emailOrMobile.includes('@') ? emailOrMobile : extraParams.email,
        mobile: typeof emailOrMobile === 'string' && !emailOrMobile.includes('@') ? emailOrMobile : extraParams.mobile
      };

      const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Resend OTP failed:', error);
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
      localStorage.removeItem('isAdmin');
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

  const sendAdminOTP = async (email = 'souravkashyap4416@gmail.com') => {
    try {
      const endpoints = [
        `${API_URL}/api/auth/admin/send-otp`,
        `${API_URL}/api/admin/send-otp`,
        `${API_URL}/api/auth/send-otp`
      ];

      let lastMessage = 'Failed to send admin OTP';
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await response.json();
          if (response.ok && data.status === 'success') {
            return { success: true, message: data.message, email: data.email };
          }
          if (data && data.message) {
            lastMessage = data.message;
          }
          if (response.status !== 404) {
            return { success: false, message: lastMessage };
          }
        } catch (err) {
          console.warn(`Endpoint ${endpoint} hit error:`, err);
        }
      }
      return { success: false, message: lastMessage };
    } catch (error) {
      console.error('sendAdminOTP error:', error);
      return { success: false, message: 'Network error sending admin OTP.' };
    }
  };

  const verifyAdminOTP = async (email, otp) => {
    try {
      const endpoints = [
        `${API_URL}/api/auth/admin/verify-otp`,
        `${API_URL}/api/admin/verify-otp`,
        `${API_URL}/api/auth/verify-otp`
      ];

      let lastMessage = 'OTP verification failed';
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, otp })
          });
          const data = await response.json();
          if (response.ok && data.status === 'success') {
            setUser(data.data.user);
            setIsAuthenticated(true);
            if (data.token) {
              localStorage.setItem('token', data.token);
            }
            return { success: true, user: data.data.user };
          }
          if (data && data.message) {
            lastMessage = data.message;
          }
          if (response.status !== 404) {
            return { success: false, message: lastMessage };
          }
        } catch (err) {
          console.warn(`Endpoint ${endpoint} hit error:`, err);
        }
      }
      return { success: false, message: lastMessage };
    } catch (error) {
      console.error('verifyAdminOTP error:', error);
      return { success: false, message: 'Network error verifying admin OTP.' };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isSignedIn: isAuthenticated, // Legacy compatibility
    login,
    signup,
    logout,
    checkAuth,
    verifyOTP,
    resendOTP,
    sendAdminOTP,
    verifyAdminOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
