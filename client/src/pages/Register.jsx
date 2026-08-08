import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupFormDemo } from "../components/ui/AuthForms";
import { FaPhone, FaKey, FaArrowLeft, FaMobileAlt } from 'react-icons/fa';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, verifyOTP, resendOTP } = useAuth();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // OTP step states
  const [step, setStep] = useState("form"); // 'form' or 'otp'
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // Preserve redirect path in sessionStorage if present
  useEffect(() => {
    if (location.state?.from) {
      sessionStorage.setItem('auth_redirect_from', location.state.from);
    }
  }, [location.state]);

  const getRedirectPath = () => {
    return location.state?.from || sessionStorage.getItem('auth_redirect_from') || '/student-dashboard';
  };

  // Check if redirected from Login due to pending verification
  useEffect(() => {
    if (location.state?.showOtp) {
      if (location.state.email) setEmail(location.state.email);
      if (location.state.mobile) setMobile(location.state.mobile);
      setStep("otp");
      setTimer(60);
      setSuccessMsg("Account verification pending. Please verify the OTP code sent to your phone number.");
    }
  }, [location.state]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSignup = async (form) => {
    setError("");
    setSuccessMsg("");
    try {
      const result = await signup(form.name, form.email, form.password, form.mobile);
      
      if (result.success) {
        setEmail(form.email);
        setMobile(form.mobile || result.mobile || "");
        setStep("otp");
        setTimer(60);
        setSuccessMsg(result.message || "Verification code sent to your phone number!");
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setError("");
    setSuccessMsg("");
    setVerifying(true);
    
    try {
      const targetIdentifier = mobile || email;
      const result = await verifyOTP(targetIdentifier, otp, { email, mobile });
      if (result.success) {
        const redirectPath = getRedirectPath();
        sessionStorage.removeItem('auth_redirect_from');
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message || "Invalid verification code");
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError("Failed to verify code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0 || resending) return;

    setError("");
    setSuccessMsg("");
    setResending(true);

    try {
      const targetIdentifier = mobile || email;
      const result = await resendOTP(targetIdentifier, { email, mobile });
      if (result.success) {
        setTimer(60);
        setSuccessMsg(result.message || "A new verification code has been sent to your phone number!");
      } else {
        setError(result.message || "Failed to resend code");
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#20b2aa]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 hover:opacity-95 transition-opacity">
            <span className="text-[#20b2aa]">Academy</span>
            <span className="text-white">Wale</span>
          </Link>
        </div>

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl text-center">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3.5 bg-red-950/70 border border-red-800 text-red-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {step === "form" ? (
          <>
            <SignupFormDemo onSignup={handleSignup} externalError={error} />
            
            <div className="mt-6 text-center text-xs font-medium text-neutral-300 border-t border-neutral-800 pt-4">
              Already have an account?{" "}
              <Link to="/login" state={{ from: getRedirectPath() }} className="text-[#20b2aa] font-bold hover:underline">
                Login
              </Link>
            </div>
          </>
        ) : (
          /* Phone OTP Verification Step */
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#20b2aa] border border-[#20b2aa]/30 shadow-lg">
                <FaMobileAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Verify Your Phone Number</h3>
              <p className="text-neutral-300 text-xs mt-2 leading-relaxed">
                We've sent a 6-digit verification code to <br />
                <strong className="text-[#20b2aa] font-bold text-sm">+91 {mobile || 'your phone number'}</strong>
                {email && <span className="block text-neutral-400 text-[11px] mt-1">(and a copy to {email})</span>}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-200">
                Verification Code (OTP)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <FaKey className="text-sm" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-neutral-950/90 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white text-center tracking-[6px] text-xl font-bold focus:outline-none focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30"
                  required
                  disabled={verifying}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying || otp.length !== 6}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all ${
                verifying || otp.length !== 6
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#20b2aa] via-teal-500 to-[#126862] text-white hover:opacity-95 shadow-[0_4px_20px_rgba(32,178,170,0.35)] cursor-pointer'
              }`}
            >
              {verifying ? "Verifying OTP..." : "Verify & Activate Account"}
            </button>

            <div className="text-center pt-2">
              {timer > 0 ? (
                <p className="text-neutral-400 text-xs">
                  Resend verification code in <span className="text-white font-bold">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-[#20b2aa] hover:underline text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {resending ? "Sending..." : "Resend Phone Verification Code"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccessMsg("");
                setStep("form");
              }}
              className="w-full flex items-center justify-center text-xs text-neutral-400 hover:text-neutral-200 transition-colors font-medium border-t border-neutral-800 pt-4 mt-2"
            >
              <FaArrowLeft className="mr-1.5" /> Back to Sign Up form
            </button>
          </form>
        )}
      </div>
    </div>
  );
}