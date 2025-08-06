import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginFormDemo } from "../components/ui/AuthForms";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <LoginFormDemo />
      <div className="mt-4 text-center text-sm">
        New to AcademyWale? <a href="/register" className="text-[#20b2aa] hover:underline">Sign Up</a>
      </div>
    </div>
  );
}