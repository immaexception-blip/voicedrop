import React from 'react';
import { Mic, Bell, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { 
    deviceFrame, 
    setDeviceFrame, 
    unreadNotifications,
    setCurrentTab
  } = useApp();

  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="logo-mic-icon">
          <Mic size={16} />
        </div>
        <span>VoiceDrop</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Device Viewport Selector */}
        <div style={{ display: 'flex', gap: '3px', background: 'var(--bg-glass)', padding: '3px', borderRadius: '20px', border: '1px solid var(--bg-card-border)' }}>
          <button 
            title="iOS Simulator"
            onClick={() => setDeviceFrame('ios')}
            style={{
              background: deviceFrame === 'ios' ? 'var(--gradient-voice)' : 'transparent',
              color: deviceFrame === 'ios' ? '#18181b' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.7rem'
            }}
          >
            🍎
          </button>
          <button 
            title="Android Simulator"
            onClick={() => setDeviceFrame('android')}
            style={{
              background: deviceFrame === 'android' ? 'var(--gradient-voice)' : 'transparent',
              color: deviceFrame === 'android' ? '#18181b' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.7rem'
            }}
          >
            🤖
          </button>
          <button 
            title="Full Window"
            onClick={() => setDeviceFrame('full')}
            style={{
              background: deviceFrame === 'full' ? 'var(--gradient-voice)' : 'transparent',
              color: deviceFrame === 'full' ? '#18181b' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.7rem'
            }}
          >
            <Monitor size={12} />
          </button>
        </div>

        {/* Notifications */}
        <button 
          onClick={() => setCurrentTab('notifications')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            position: 'relative',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Bell size={20} />
          {unreadNotifications > 0 && (
            <span className="badge-dot" />
          )}
        </button>
      </div>
    </header>
  );
}
