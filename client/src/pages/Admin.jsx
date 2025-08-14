import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

const ADMIN_EMAIL = 'admin@academywale.com';
const ADMIN_PASSWORD = 'AdminAcademy12';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // First client-side validation for hardcoded credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Then make a backend auth request to set cookies
        const response = await fetch(`${API_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include' // Important to include cookies
        });

        if (response.ok) {
          localStorage.setItem('isAdmin', 'true');
          navigate('/admin-dashboard');
        } else {
          const data = await response.json();
          setError(data.error || 'Authentication failed');
        }
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback to client-side auth if server is down
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin-dashboard');
      } else {
        setError('Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-[#20b2aa]">
        <h2 className="text-2xl font-bold text-center text-[#17817a] mb-2">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#20b2aa]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-xl shadow-lg transition-all text-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 