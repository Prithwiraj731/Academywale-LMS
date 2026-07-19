import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const requestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();

      if (res.ok && data.emailSent) {
        setSuccess(data.message || 'Password reset code sent to your email.');
        setStep('reset');
      } else if (res.ok) {
        setError('We could not send an OTP for this email. Please use the email address registered to your AcademyWale account.');
      } else {
        setError(data.message || 'Failed to send password reset code.');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp,
          password
        })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || 'Password updated successfully.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 py-12 px-4">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
            <span className="text-[#20b2aa]">Academy</span>
            <span className="text-white">Wale</span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight text-center">
          Reset Password
        </h2>
        <p className="text-neutral-400 text-sm mt-2 text-center">
          {step === 'email'
            ? 'Enter your account email to receive an OTP.'
            : 'Enter the OTP from your email and set a new password.'}
        </p>

        {error && (
          <div className="mt-5 bg-red-950/60 border border-red-900 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 bg-teal-950/60 border border-teal-900 text-teal-200 px-4 py-3 rounded-xl text-sm text-center">
            {success}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={requestOtp} className="mt-8 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registered email"
              autoComplete="email"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="mt-8 space-y-4">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit OTP"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-white text-center tracking-[4px] font-bold focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={requestOtp}
              disabled={loading}
              className="w-full text-[#20b2aa] text-sm font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-neutral-400 border-t border-neutral-800 pt-4">
          Remembered your password?{' '}
          <Link to="/login" className="text-[#20b2aa] font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
