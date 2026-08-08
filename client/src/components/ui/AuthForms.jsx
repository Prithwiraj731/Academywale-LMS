"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { MorphyButton } from "../ui/morphy-button";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

export function SignupFormDemo({ onSignup, externalError }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields (Name, Email, Password, and Phone Number)
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim() || !form.mobile?.trim()) {
      setError("Name, email address, password, and phone number are required");
      return;
    }

    const cleanMobile = form.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      if (onSignup) {
        const trimmedForm = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          mobile: cleanMobile
        };
        
        console.log('Submitting signup form:', trimmedForm);
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        );
        
        await Promise.race([onSignup(trimmedForm), timeoutPromise]);
      }
    } catch (error) {
      console.error('Signup form error:', error);
      setError(error.message || "An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md bg-transparent">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Your Account
        </h2>
        <p className="text-neutral-300 text-sm mt-1.5 font-medium leading-relaxed">
          Sign up with your details to access professional CA & CMA courses.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <LabelInputContainer>
          <Label htmlFor="name" className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Full Name <span className="text-[#20b2aa]">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <FaUser className="text-sm" />
            </div>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              value={form.name} 
              onChange={handleChange} 
              required 
              className="pl-10 bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30 rounded-xl py-3 text-sm font-medium transition-all"
            />
          </div>
        </LabelInputContainer>

        {/* Email Address */}
        <LabelInputContainer>
          <Label htmlFor="email" className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Email Address <span className="text-[#20b2aa]">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <FaEnvelope className="text-sm" />
            </div>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email} 
              onChange={handleChange} 
              required 
              className="pl-10 bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30 rounded-xl py-3 text-sm font-medium transition-all"
            />
          </div>
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer>
          <Label htmlFor="password" className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Create Password <span className="text-[#20b2aa]">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <FaLock className="text-sm" />
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.password} 
              onChange={handleChange} 
              required 
              className="pl-10 bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30 rounded-xl py-3 text-sm font-medium transition-all"
            />
          </div>
        </LabelInputContainer>

        {/* Phone Number */}
        <LabelInputContainer>
          <Label htmlFor="mobile" className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Phone Number <span className="text-[#20b2aa]">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <FaPhone className="text-sm" />
            </div>
            <Input 
              id="mobile" 
              name="mobile" 
              type="tel" 
              placeholder="+91 98765 43210"
              autoComplete="tel"
              value={form.mobile} 
              onChange={handleChange} 
              required
              className="pl-10 bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30 rounded-xl py-3 text-sm font-medium transition-all"
            />
          </div>
        </LabelInputContainer>

        {(error || externalError) && (
          <div className="text-red-400 text-xs font-semibold bg-red-950/60 p-3 rounded-xl border border-red-800/80 text-center animate-pulse">
            {error || externalError}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 ${
            loading 
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#20b2aa] via-teal-500 to-[#126862] text-white hover:opacity-95 shadow-[0_4px_20px_rgba(32,178,170,0.35)] cursor-pointer'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending Verification OTP...
            </span>
          ) : (
            "Verify Phone & Create Account"
          )}
        </button>
      </form>
    </div>
  );
}

export function LoginFormDemo({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email?.trim() || !form.password?.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      if (onLogin) {
        const trimmedForm = {
          email: form.email.trim(),
          password: form.password.trim()
        };
        await onLogin(trimmedForm);
      }
    } catch (error) {
      console.error('Login form error:', error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md bg-transparent">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-neutral-300 text-sm mt-1.5 font-medium leading-relaxed">
          Login to manage your courses, view paper info, and check out.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="login-email" className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <FaEnvelope className="text-sm" />
            </div>
            <Input 
              id="login-email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email} 
              onChange={handleChange} 
              required 
              className="pl-10 bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30 rounded-xl py-3 text-sm font-medium transition-all"
            />
          </div>
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="login-password" className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <FaLock className="text-sm" />
            </div>
            <Input 
              id="login-password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password} 
              onChange={handleChange} 
              required 
              className="pl-10 bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30 rounded-xl py-3 text-sm font-medium transition-all"
            />
          </div>
        </LabelInputContainer>

        {error && (
          <div className="text-red-400 text-xs font-semibold bg-red-950/60 p-3 rounded-xl border border-red-800/80 text-center animate-pulse">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 ${
            loading 
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#20b2aa] via-teal-500 to-[#126862] text-white hover:opacity-95 shadow-[0_4px_20px_rgba(32,178,170,0.35)] cursor-pointer'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Logging in...
            </span>
          ) : (
            "Login to Account"
          )}
        </button>
      </form>
    </div>
  );
}

function LabelInputContainer({ children, className }) {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
}
