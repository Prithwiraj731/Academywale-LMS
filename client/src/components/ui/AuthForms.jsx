"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_URL;

export function SignupFormDemo() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Signup successful! Please login.");
        setForm({ name: "", email: "", password: "" });
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Sign Up</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
        </LabelInputContainer>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
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

export function LoginFormDemo() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Login successful!");
        // Save credentials/token as needed
        localStorage.setItem("token", data.token);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Login</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
        </LabelInputContainer>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
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
