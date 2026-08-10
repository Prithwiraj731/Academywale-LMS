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
      // 1. Try dedicated admin OTP route
      const response = await fetch(`${API_URL}/api/auth/admin/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        return { success: true, message: data.message, email: data.email };
      }

      // If route not found (404), use fallback OTP dispatch route
      if (response.status === 404) {
        console.warn('⚠️ Dedicated admin OTP route not found. Invoking fallback OTP email dispatch...');
        const fallbackRes = await fetch(`${API_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && (fallbackData.status === 'success' || fallbackData.emailSent)) {
          return {
            success: true,
            message: `Admin verification code sent to ${email}. Please check your inbox or spam folder.`,
            email
          };
        }
        return { success: false, message: fallbackData.message || 'Failed to dispatch Admin OTP' };
      }

      return { success: false, message: data.message || 'Failed to send admin OTP' };
    } catch (error) {
      console.error('sendAdminOTP error:', error);
      return { success: false, message: 'Network error sending admin OTP.' };
    }
  };

  const verifyAdminOTP = async (email, otp) => {
    try {
      // 1. Try dedicated admin OTP verification route
      const response = await fetch(`${API_URL}/api/auth/admin/verify-otp`, {
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

      // If route not found (404), use fallback OTP verification route
      if (response.status === 404) {
        console.warn('⚠️ Dedicated admin OTP verify route not found. Executing fallback verification...');
        const tempPassword = `AdminPass_${Date.now()}`;
        const resetRes = await fetch(`${API_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, password: tempPassword })
        });

        const resetData = await resetRes.json();
        if (!resetRes.ok) {
          return { success: false, message: resetData.message || 'Incorrect verification code' };
        }

        // Login with updated credentials
        const loginRes = await login(email, tempPassword);
        if (loginRes.success) {
          return { success: true, user: loginRes.user };
        }
        return { success: false, message: loginRes.message || 'Admin login verification failed' };
      }

      return { success: false, message: data.message || 'OTP verification failed' };
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
