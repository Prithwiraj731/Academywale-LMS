import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const [email, setEmail] = useState('souravkashyap4416@gmail.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email/Send OTP, 2: Verify OTP
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const { sendAdminOTP, verifyAdminOTP, user, isAuthenticated } = useAuth();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin-dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Cooldown timer for OTP resend
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your admin email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await sendAdminOTP(email.trim());
      if (res.success) {
        setStep(2);
        setSuccessMsg(res.message || `Security OTP sent to ${email.trim()}`);
        setCooldown(60);
      } else {
        setError(res.message || 'Failed to send admin OTP.');
      }
    } catch (err) {
      console.error('Send admin OTP error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyAdminOTP(email.trim(), otp.trim());
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          setError('Access denied. Account does not have admin privileges.');
        }
      } else {
        setError(res.message || 'OTP verification failed.');
      }
    } catch (err) {
      console.error('Verify admin OTP error:', err);
      setError('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-4 py-8">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-teal-500/20 flex flex-col gap-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-lg mb-2">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Security Portal</h2>
          <p className="text-xs text-slate-500 font-medium">
            Passwordless 2FA Security Access for <span className="font-bold text-teal-700">souravkashyap4416@gmail.com</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in text-center">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in text-center">
            ✅ {successMsg}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Request OTP Form */
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Admin Email
              </label>
              <input
                type="email"
                placeholder="souravkashyap4416@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 font-semibold text-slate-800"
                required
              />
            </div>

            <div className="bg-teal-50/70 border border-teal-200/60 rounded-xl p-3.5 text-[11px] text-teal-900 leading-relaxed font-medium">
              💡 <strong>High Security Enforced:</strong> Password authentication is disabled for admin access to eliminate XSS & credential leaks. Login codes are sent directly to your email.
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2 cursor-pointer ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-teal-500/25'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Sending Code...</span>
                </>
              ) : (
                <span>🔒 Request Admin OTP</span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Verify OTP Form */
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter 6-Digit OTP
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Sent to {email}</span>
              </div>
              <input
                type="text"
                maxLength="6"
                placeholder="e.g. 849201"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 font-mono text-teal-900"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2 cursor-pointer ${
                loading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-teal-500/25'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>🚀 Verify OTP & Login</span>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-slate-500 hover:text-teal-700 font-semibold transition-colors cursor-pointer"
              >
                ← Change Email
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendOTP()}
                className={`font-bold transition-colors cursor-pointer ${
                  cooldown > 0 || loading
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-teal-600 hover:text-teal-800 underline'
                }`}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
