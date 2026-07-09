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
        // After successful signup, redirect to login page with success message
        navigate('/login', { 
          state: { 
            signupSuccess: true, 
            message: "Account created successfully! Please login with your credentials." 
          }
        });
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
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

        <SignupFormDemo onSignup={handleSignup} externalError={error} />

        <div className="mt-6 text-center text-sm text-neutral-400 border-t border-neutral-800 pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#20b2aa] font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}