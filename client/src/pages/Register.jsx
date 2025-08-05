import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    
    const result = await signup(form.name, form.email, form.password);
    
    if (result.success) {
      // Check if user is admin
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#17817a]">Create Your Account</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#20b2aa]" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#20b2aa]" />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#20b2aa]" />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#20b2aa]" />
            <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{showConfirmPassword ? 'Hide' : 'Show'}</button>
          </div>
          <button type="submit" className="w-full bg-[#20b2aa] text-white py-2 rounded font-semibold hover:bg-[#17817a] transition" disabled={loading}>{loading ? 'Registering...' : 'Sign Up'}</button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-[#20b2aa] hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}