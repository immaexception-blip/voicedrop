import React, { useState } from 'react';
import { Mic, Settings, Sun, Moon, Monitor, X, Check, RefreshCw, LogIn, LogOut, UserPlus, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { 
    user,
    deviceFrame, 
    setDeviceFrame, 
    themeMode, 
    setThemeMode,
    setIsAuthModalOpen,
    logout,
    showToast
  } = useApp();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleClearCache = () => {
    localStorage.removeItem('voicedrop_posts');
    showToast("App cache refreshed! 🧹");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <>
      <header className="app-header">
        <div className="brand-logo">
          <div className="logo-mic-icon">
            <Mic size={16} />
          </div>
          <span>VoiceDrop</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* App Settings Top-Right Button */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="App Settings"
          >
            <Settings size={18} color="var(--accent-aqua)" />
          </button>
        </div>
      </header>

      {/* App Settings Instagram-Style Full Page Screen */}
      {isSettingsOpen && (
        <div className="full-page-screen">
          <div className="full-page-header">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={22} />
            </button>

            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              App Settings
            </span>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              style={{
                background: 'var(--gradient-aqua)',
                border: 'none',
                color: '#0f172a',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>

          <div className="full-page-body">
            {/* Account & Auth Section */}
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>
                ACCOUNT & AUTHENTICATION
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <img src={user.avatar} alt={user.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>@{user.username}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => { setIsSettingsOpen(false); setIsAuthModalOpen(true); }}
                  style={{
                    flex: 1,
                    background: 'var(--gradient-aqua)',
                    color: '#0f172a',
                    border: 'none',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <LogIn size={16} />
                  <span>Switch Account / Log In</span>
                </button>

                <button 
                  onClick={() => { logout(); setIsSettingsOpen(false); }}
                  style={{
                    background: 'rgba(244,63,94,0.1)',
                    border: '1px solid rgba(244,63,94,0.3)',
                    color: 'var(--accent-rose)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* 1. App Theme Selection */}
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>
                APP APPEARANCE & THEME
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button 
                  onClick={() => setThemeMode('light')}
                  style={{
                    background: themeMode === 'light' ? 'var(--gradient-aqua)' : 'var(--bg-card)',
                    color: themeMode === 'light' ? '#0f172a' : 'var(--text-primary)',
                    border: themeMode === 'light' ? 'none' : '1px solid var(--bg-card-border)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Sun size={18} />
                  <span>White Theme</span>
                </button>

                <button 
                  onClick={() => setThemeMode('dark')}
                  style={{
                    background: themeMode === 'dark' ? 'var(--gradient-aqua)' : 'var(--bg-card)',
                    color: themeMode === 'dark' ? '#0f172a' : 'var(--text-primary)',
                    border: themeMode === 'dark' ? 'none' : '1px solid var(--bg-card-border)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Moon size={18} />
                  <span>Black Theme</span>
                </button>
              </div>
            </div>

            {/* 2. Device Viewport Frame */}
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>
                DEVICE FRAME VIEWPORT
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button 
                  onClick={() => setDeviceFrame('ios')}
                  style={{
                    background: deviceFrame === 'ios' ? 'var(--gradient-aqua)' : 'var(--bg-card)',
                    color: deviceFrame === 'ios' ? '#0f172a' : 'var(--text-primary)',
                    border: deviceFrame === 'ios' ? 'none' : '1px solid var(--bg-card-border)',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🍎 iOS</span>
                </button>

                <button 
                  onClick={() => setDeviceFrame('android')}
                  style={{
                    background: deviceFrame === 'android' ? 'var(--gradient-aqua)' : 'var(--bg-card)',
                    color: deviceFrame === 'android' ? '#0f172a' : 'var(--text-primary)',
                    border: deviceFrame === 'android' ? 'none' : '1px solid var(--bg-card-border)',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🤖 Android</span>
                </button>

                <button 
                  onClick={() => setDeviceFrame('full')}
                  style={{
                    background: deviceFrame === 'full' ? 'var(--gradient-aqua)' : 'var(--bg-card)',
                    color: deviceFrame === 'full' ? '#0f172a' : 'var(--text-primary)',
                    border: deviceFrame === 'full' ? 'none' : '1px solid var(--bg-card-border)',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Monitor size={14} />
                  <span>Full</span>
                </button>
              </div>
            </div>

            {/* 3. Storage & Refresh */}
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px'
            }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                DATA & CACHE
              </label>

              <button 
                onClick={handleClearCache}
                style={{
                  width: '100%',
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  color: 'var(--accent-rose)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                <span>Reset Demo Storage Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
