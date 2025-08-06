import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupFormDemo } from "../components/ui/AuthForms";

export default function Register() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");

  const handleSignup = async (form) => {
    setError("");
    try {
      const result = await signup(form.name, form.email, form.password, form.mobile);
      
      if (result.success) {
        // Check if user is admin
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <SignupFormDemo onSignup={handleSignup} externalError={error} />
      <div className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-[#20b2aa] hover:underline">Login</Link>
      </div>
    </div>
  );
}