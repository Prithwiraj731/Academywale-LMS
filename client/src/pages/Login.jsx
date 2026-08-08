import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginFormDemo } from "../components/ui/AuthForms";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Save redirect origin into sessionStorage if provided in state
  useEffect(() => {
    if (location.state?.from) {
      sessionStorage.setItem('auth_redirect_from', location.state.from);
    }
  }, [location.state]);

  const getRedirectPath = () => {
    return location.state?.from || sessionStorage.getItem('auth_redirect_from') || '/';
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        const redirectPath = getRedirectPath();
        sessionStorage.removeItem('auth_redirect_from');
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Check if coming from successful signup
  useEffect(() => {
    if (location.state?.signupSuccess) {
      setSuccessMessage(location.state.message || "Account created successfully! Please login.");
    }
  }, [location.state]);

  const handleLogin = async (form) => {
    setError("");
    setSuccessMessage("");
    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          const redirectPath = getRedirectPath();
          sessionStorage.removeItem('auth_redirect_from');
          navigate(redirectPath, { replace: true });
        }
      } else {
        if (result.code === 'PENDING_VERIFICATION') {
          const redirectPath = getRedirectPath();
          navigate('/register', {
            state: {
              email: result.email,
              showOtp: true,
              from: redirectPath
            }
          });
        } else {
          setError(result.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#20b2aa]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 hover:opacity-95 transition-opacity">
            <span className="text-[#20b2aa]">Academy</span>
            <span className="text-white">Wale</span>
          </Link>
        </div>

        <LoginFormDemo onLogin={handleLogin} />

        {successMessage && (
          <div className="mt-4 p-3.5 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3.5 bg-red-950/70 border border-red-800 text-red-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-xs font-medium text-neutral-400 border-t border-neutral-800 pt-4 flex items-center justify-between">
          <Link to="/forgot-password" className="text-[#20b2aa] font-semibold hover:underline">
            Forgot password?
          </Link>
          <span className="text-neutral-500">•</span>
          <Link to="/register" state={{ from: getRedirectPath() }} className="text-[#20b2aa] font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
