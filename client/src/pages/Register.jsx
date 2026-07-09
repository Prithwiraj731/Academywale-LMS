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

        <SignupFormDemo onSignup={handleSignup} externalError={error} />

        <div className="mt-6 text-center text-sm text-neutral-400 border-t border-white/5 pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}