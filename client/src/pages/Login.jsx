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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
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
    setSuccessMessage(""); // Clear success message when attempting login
    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        // Check if user is admin
        if (result.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          // Navigate to homepage after successful login
          navigate('/');
        }
      } else {
        if (result.code === 'PENDING_VERIFICATION') {
          navigate('/register', {
            state: {
              email: result.email,
              showOtp: true
            }
          });
        } else {
          setError(result.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 py-12 px-4">
      {/* Card Container */}
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-2xl">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
            <span className="text-[#20b2aa]">Academy</span>
            <span className="text-white">Wale</span>
          </Link>
        </div>

        <LoginFormDemo onLogin={handleLogin} />

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-sm rounded-lg text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-900 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-neutral-400 border-t border-neutral-800 pt-4">
          New to AcademyWale?{" "}
          <Link to="/register" className="text-[#20b2aa] font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}