import React, { useState } from 'react';
import { X, Mail, Lock, User, AtSign, LogIn, UserPlus, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithEmail, signUpWithEmail } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    if (mode === 'login') {
      await loginWithEmail({ email, password });
    } else {
      if (!name || !username) {
        setIsLoading(false);
        return;
      }
      await signUpWithEmail({ email, password, name, username });
    }
    setIsLoading(false);
  };

  return (
    <div className="full-page-screen" style={{ zIndex: 1100 }}>
      {/* Header */}
      <div className="full-page-header">
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={18} color="var(--accent-aqua)" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </span>
        </div>

        <div style={{ width: '32px' }} />
      </div>

      {/* Auth Screen Body */}
      <div className="full-page-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100% - 60px)', padding: '24px 20px' }}>
        
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--gradient-aqua)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            margin: '0 auto 14px auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={32} />
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            VoiceDrop
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {mode === 'login' ? 'Log in to your voice social account' : 'Join close friends on VoiceDrop'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {mode === 'signup' && (
            <>
              {/* Full Name */}
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

              {/* Username */}
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
            </>
          )}

          {/* Email Field */}
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
            />
          </div>

          {/* Password Field */}
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

          {/* Submit Button */}
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
            {mode === 'login' ? (
              <>
                <LogIn size={18} />
                <span>{isLoading ? 'Logging In...' : 'Log In'}</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-aqua)',
              fontSize: '0.84rem',
              fontWeight: '800',
              marginLeft: '8px',
              cursor: 'pointer'
            }}
          >
            {mode === 'login' ? 'Create Account' : 'Log In'}
          </button>
        </div>

      </div>
    </div>
  );
}
