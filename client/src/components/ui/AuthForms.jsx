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
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Sign Up</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name" 
            autoComplete="name"
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
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
            autoComplete="new-password"
            value={form.password} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="mobile">Mobile (Optional)</Label>
          <Input 
            id="mobile" 
            name="mobile" 
            type="tel" 
            autoComplete="tel"
            value={form.mobile} 
            onChange={handleChange} 
          />
        </LabelInputContainer>
        {(error || externalError) && <div className="text-red-500 text-sm">{error || externalError}</div>}
        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-300">Or sign up with</span>
        <div className="flex gap-2">
          <button type="button" className="p-2 rounded bg-neutral-100 dark:bg-neutral-800"><IconBrandGoogle size={20} /></button>
          <button type="button" className="p-2 rounded bg-neutral-100 dark:bg-neutral-800"><IconBrandGithub size={20} /></button>
        </div>
      </div>
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
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Login</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="login-email">Email</Label>
          <Input 
            id="login-email" 
            name="email" 
            type="email" 
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
            autoComplete="current-password"
            value={form.password} 
            onChange={handleChange} 
            required 
          />
        </LabelInputContainer>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-300">Or login with</span>
        <div className="flex gap-2">
          <button type="button" className="p-2 rounded bg-neutral-100 dark:bg-neutral-800"><IconBrandGoogle size={20} /></button>
          <button type="button" className="p-2 rounded bg-neutral-100 dark:bg-neutral-800"><IconBrandGithub size={20} /></button>
        </div>
      </div>
    </div>
  );
}

function LabelInputContainer({ children, className }) {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
}
