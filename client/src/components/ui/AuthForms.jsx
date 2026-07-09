"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export function SignupFormDemo({ onSignup, externalError }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields (trim whitespace)
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      setError("Name, email, and password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      if (onSignup) {
        // Use the parent component's signup handler with trimmed data
        const trimmedForm = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          mobile: form.mobile?.trim() || ""
        };
        
        console.log('Submitting signup form:', trimmedForm);
        
        // Add timeout protection
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
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight text-center md:text-left">
        Create Your Account
      </h2>
      <p className="text-neutral-500 text-sm max-w-sm mt-2 text-center md:text-left dark:text-neutral-400">
        Sign up to start browsing papers, courses, and faculties.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="John Doe"
            autoComplete="name"
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.password} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="mobile">Mobile Number (Optional)</Label>
          <Input 
            id="mobile" 
            name="mobile" 
            type="tel" 
            placeholder="+91 99999 99999"
            autoComplete="tel"
            value={form.mobile} 
            onChange={handleChange} 
          />
        </LabelInputContainer>

        {(error || externalError) && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-2.5 rounded border border-red-200 dark:border-red-900/50">
            {error || externalError}
          </div>
        )}

        <button 
          type="submit" 
          className="relative group/btn bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 block w-full text-white rounded-md h-10 font-semibold shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition duration-200" 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Account...
            </span>
          ) : (
            "Sign Up"
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
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields (trim whitespace)
    if (!form.email?.trim() || !form.password?.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      if (onLogin) {
        // Use the parent component's login handler with trimmed data
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
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight text-center md:text-left">
        Welcome Back
      </h2>
      <p className="text-neutral-500 text-sm max-w-sm mt-2 text-center md:text-left dark:text-neutral-400">
        Login to manage your courses, view paper info, and check out.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="login-email">Email Address</Label>
          <Input 
            id="login-email" 
            name="email" 
            type="email" 
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="login-password">Password</Label>
          <Input 
            id="login-password" 
            name="password" 
            type="password" 
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-2.5 rounded border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="relative group/btn bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 block w-full text-white rounded-md h-10 font-semibold shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition duration-200" 
          disabled={loading}
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
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}

function LabelInputContainer({ children, className }) {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
}
