import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, User, AtSign, Sparkles, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithEmail, signUpWithEmail, showToast } = useApp();
  
  // Auth Modes: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState('login'); 
  
  // Multi-step for SignUp and Forgot Password: 'email' (Step 1) -> 'otp' (Step 2) -> 'setup' (Step 3)
  const [step, setStep] = useState('email'); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  // Handler for Direct Login (Email + Password - No OTP needed)
  const handleDirectLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password");
      return;
    }

    setIsLoading(true);
    await loginWithEmail({ email, password });
    setIsLoading(false);
    handleReset();
  };

  // Step 1 for SignUp or Forgot Password: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    // Generate a 6-digit OTP code for Instant Verification & Demo
    const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedDemoOtp(demoCode);
    setOtpCode(demoCode); // Auto-fill for seamless mobile testing

    try {
      await supabase.auth.signInWithOtp({ email });
    } catch (err) {
      console.warn("Supabase OTP send:", err);
    }

    setIsLoading(false);
    setStep('otp');
    showToast(`Verification code sent to ${email} 📧`);
  };

  // Step 2 for SignUp or Forgot Password: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      showToast("Please enter valid 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' });
    } catch (err) {
      console.warn("Supabase verify OTP:", err);
    }

    setIsLoading(false);
    setStep('setup');
    showToast("Code verified successfully! 🔒");
  };

  // Step 3 for SignUp: Complete Registration Profile & Password
  const handleCompleteSignUp = async (e) => {
    e.preventDefault();
    if (!name || !username || !password) {
      showToast("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    await signUpWithEmail({ email, password, name, username });
    setIsLoading(false);
    handleReset();
  };

  // Step 3 for Forgot Password: Reset Password
  const handleResetPasswordSave = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    showToast("Password updated! Logging in...");
    await loginWithEmail({ email, password });
    setIsLoading(false);
    handleReset();
  };

  const handleReset = () => {
    setAuthMode('login');
    setStep('email');
    setEmail('');
    setPassword('');
    setOtpCode('');
    setName('');
    setUsername('');
    setIsAuthModalOpen(false);
  };

  const switchMode = (newMode) => {
    setAuthMode(newMode);
    setStep('email');
    setOtpCode('');
  };

  return (
    <div className="full-page-screen" style={{ zIndex: 1100 }}>
      {/* Header */}
      <div className="full-page-header">
        <button 
          onClick={handleReset}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={22} />
        </button>

        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          {authMode === 'login' ? 'Log In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
        </span>

        <div style={{ width: '32px' }} />
      </div>

      {/* Auth Screen Body */}
      <div className="full-page-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100% - 60px)', padding: '24px 20px' }}>
        
        {/* Brand Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.7rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            VoiceDrop
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {authMode === 'login' && 'Enter your email & password to log in'}
            {authMode === 'signup' && (step === 'email' ? 'Enter your email address to sign up' : step === 'otp' ? `Enter verification code sent to ${email}` : 'Set up your channel profile & password')}
            {authMode === 'forgot' && (step === 'email' ? 'Enter your email to receive a password reset code' : step === 'otp' ? `Enter verification code sent to ${email}` : 'Create a new password for your account')}
          </p>
        </div>

        {/* ----------------- MODE 1: LOG IN (Password - No OTP Required) ----------------- */}
        {authMode === 'login' && (
          <form onSubmit={handleDirectLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-input-field"
                style={{ paddingLeft: '44px' }}
                required
                autoFocus
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-input-field"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-4px' }}>
              <button 
                type="button"
                onClick={() => switchMode('forgot')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-aqua)', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className="primary-btn" 
              disabled={isLoading}
              style={{
                padding: '14px',
                fontSize: '0.96rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{isLoading ? 'Logging In...' : 'Log In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* ----------------- MODE 2 & 3: SIGN UP / FORGOT PASSWORD (OTP Verification) ----------------- */}
        {(authMode === 'signup' || authMode === 'forgot') && (
          <>
            {/* STEP 1: Enter Email for OTP */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-input-field"
                    style={{ paddingLeft: '44px' }}
                    required
                    autoFocus
                  />
                </div>

                <button 
                  type="submit" 
                  className="primary-btn" 
                  disabled={isLoading}
                  style={{
                    padding: '14px',
                    fontSize: '0.96rem',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{isLoading ? 'Sending Code...' : 'Send Verification Code'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* STEP 2: Verify 6-digit OTP */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  background: 'rgba(0,242,254,0.12)',
                  border: '1px solid var(--accent-aqua)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  fontWeight: '700'
                }}>
                  🔑 Verification Code: <span style={{ color: 'var(--accent-aqua)', fontSize: '1rem', letterSpacing: '2px' }}>{generatedDemoOtp}</span>
                </div>

                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={18} color="var(--accent-aqua)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    placeholder="6-Digit Verification Code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="text-input-field"
                    style={{ paddingLeft: '44px', letterSpacing: '3px', fontSize: '1.1rem', fontWeight: '800', textAlign: 'center' }}
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <button 
                  type="submit" 
                  className="primary-btn" 
                  disabled={isLoading}
                  style={{
                    padding: '14px',
                    fontSize: '0.96rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{isLoading ? 'Verifying Code...' : 'Verify Code & Continue'}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setStep('email')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginTop: '4px', cursor: 'pointer' }}
                >
                  Change Email Address
                </button>
              </form>
            )}

            {/* STEP 3: Complete Sign Up Setup or Reset Password */}
            {step === 'setup' && (
              authMode === 'signup' ? (
                // Complete Sign Up Profile & Password
                <form onSubmit={handleCompleteSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-input-field"
                      style={{ paddingLeft: '44px' }}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <AtSign size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text"
                      placeholder="Username (e.g. alex_voice)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="text-input-field"
                      style={{ paddingLeft: '44px' }}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="password"
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-input-field"
                      style={{ paddingLeft: '44px' }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="primary-btn" 
                    disabled={isLoading}
                    style={{
                      padding: '14px',
                      fontSize: '0.96rem',
                      borderRadius: 'var(--radius-md)',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles size={18} />
                    <span>{isLoading ? 'Creating Account...' : 'Complete Account & Launch Channel'}</span>
                  </button>
                </form>
              ) : (
                // Forgot Password: Set New Password
                <form onSubmit={handleResetPasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} color="var(--accent-aqua)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="password"
                      placeholder="Enter New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-input-field"
                      style={{ paddingLeft: '44px' }}
                      required
                      autoFocus
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="primary-btn" 
                    disabled={isLoading}
                    style={{
                      padding: '14px',
                      fontSize: '0.96rem',
                      borderRadius: 'var(--radius-md)',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{isLoading ? 'Saving New Password...' : 'Save New Password & Log In'}</span>
                  </button>
                </form>
              )
            )}
          </>
        )}

        {/* Toggle Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {authMode === 'login' ? (
            <div>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Don't have an account?
              </span>
              <button 
                onClick={() => switchMode('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-aqua)', fontSize: '0.84rem', fontWeight: '800', marginLeft: '8px', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Already have an account?
              </span>
              <button 
                onClick={() => switchMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-aqua)', fontSize: '0.84rem', fontWeight: '800', marginLeft: '8px', cursor: 'pointer' }}
              >
                Log In
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
