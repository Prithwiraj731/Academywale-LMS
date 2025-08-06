import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginFormDemo } from "../components/ui/AuthForms";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (form) => {
    setError("");
    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        // Check if user is admin
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          // Navigate to intended page or dashboard
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <LoginFormDemo onLogin={handleLogin} />
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mt-4 text-center text-sm">
        New to AcademyWale? <Link to="/register" className="text-[#20b2aa] hover:underline">Sign Up</Link>
      </div>
    </div>
  );
}