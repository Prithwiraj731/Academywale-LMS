import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupFormDemo } from "../components/ui/AuthForms";
import { FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, verifyOTP, resendOTP } = useAuth();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // OTP step states
  const [step, setStep] = useState("form"); // 'form' or 'otp'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // Check if redirected from Login due to pending verification
  useEffect(() => {
    if (location.state?.showOtp && location.state?.email) {
      setEmail(location.state.email);
      setStep("otp");
      setTimer(60);
      setSuccessMsg("Account verification pending. Please verify with the OTP code.");
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
        setStep("otp");
        setTimer(60);
        setSuccessMsg(result.message || "Verification code sent to your email!");
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
      const result = await verifyOTP(email, otp);
      if (result.success) {
        // Success! User is authenticated and context state updated.
        navigate('/student-dashboard');
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
      const result = await resendOTP(email);
      if (result.success) {
        setSuccessMsg("Verification code resent successfully!");
        setTimer(60);
      } else {
        setError(result.message || "Failed to resend code");
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 py-12 px-4">
      {/* Card Container */}
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-2xl">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
            <span className="text-[#20b2aa]">Academy</span>
            <span className="text-white">Wale</span>
          </Link>
          <p className="text-neutral-400 text-xs mt-1 font-medium">Verify & Learn from Best Faculty</p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-900 text-red-200 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-teal-950/60 border border-teal-900 text-teal-200 px-4 py-3 rounded-xl text-sm mb-4 text-center animate-pulse">
            {successMsg}
          </div>
        )}

        {step === "form" ? (
          <>
            <SignupFormDemo onSignup={handleSignup} externalError={error} />
            
            <div className="mt-6 text-center text-sm text-neutral-400 border-t border-neutral-800 pt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#20b2aa] font-semibold hover:underline">
                Login
              </Link>
            </div>
          </>
        ) : (
          /* OTP Verification Step */
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-neutral-800/80 rounded-full flex items-center justify-center mx-auto mb-3 text-[#20b2aa] border border-neutral-700">
                <FaEnvelope className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirm your Email</h3>
              <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                We've sent a 6-digit verification code to <br />
                <strong className="text-[#20b2aa] font-semibold">{email}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <FaKey />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                  placeholder="Enter 6-digit code"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white text-center tracking-[4px] text-lg font-bold focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa]"
                  required
                  disabled={verifying}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying || otp.length !== 6}
              className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                verifying || otp.length !== 6
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:opacity-95 shadow-lg'
              }`}
            >
              {verifying ? "Verifying..." : "Verify & Activate Account"}
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
                  className="text-[#20b2aa] hover:underline text-xs font-bold focus:outline-none"
                >
                  {resending ? "Sending..." : "Resend Verification Code"}
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
              className="w-full flex items-center justify-center text-xs text-neutral-500 hover:text-neutral-400 transition-colors font-medium border-t border-neutral-800/80 pt-4 mt-2"
            >
              <FaArrowLeft className="mr-1.5" /> Back to Sign Up form
            </button>
          </form>
        )}
      </div>
    </div>
  );
}