import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginFormDemo } from "../components/ui/AuthForms";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
          navigate('/admin');
        } else {
          // Navigate to homepage after successful login
          navigate('/');
        }
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-950 py-12 px-4 overflow-hidden">
      {/* Decorative gradient blur backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:scale-105 transition-transform duration-200">
            <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">Academy</span>
            <span className="text-teal-400">Wale</span>
          </Link>
        </div>

        <LoginFormDemo onLogin={handleLogin} />

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800 text-emerald-300 text-sm rounded-lg text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-950/30 border border-red-800 text-red-300 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-neutral-400 border-t border-white/5 pt-4">
          New to AcademyWale?{" "}
          <Link to="/register" className="text-teal-400 font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}