import React from 'react';
import { Sparkles, Mic, Heart, Lock, ArrowRight, Radio, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WelcomeScreen() {
  const { setIsAuthModalOpen } = useApp();

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'var(--bg-app)',
      zIndex: 900,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      animation: 'fadeIn 0.3s ease'
    }}>
      {/* Background Hero Accent Glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, rgba(2, 132, 199, 0.05) 70%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '36px 20px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2,
        maxWidth: '440px',
        margin: '0 auto',
        width: '100%'
      }}>

        {/* Top Brand Logo & Title */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background: 'var(--gradient-aqua)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            margin: '0 auto 16px auto',
            boxShadow: 'var(--shadow-glow)',
            transform: 'rotate(-4deg)'
          }}>
            <Mic size={36} strokeWidth={2.5} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 242, 254, 0.12)',
            border: '1px solid var(--accent-aqua)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '0.74rem',
            fontWeight: '800',
            color: 'var(--accent-aqua)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <Sparkles size={12} />
            <span>Intimate Voice Social Platform</span>
          </div>

          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: '900',
            fontSize: '2rem',
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            marginBottom: '10px'
          }}>
            Share Moments with Real Voice 🎙️
          </h1>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.45',
            padding: '0 10px'
          }}>
            Send photo stories paired with authentic voice narration to your close friends and loved ones. Hear real emotion, laughter, and warmth in their actual voice.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          margin: '24px 0'
        }}>
          {/* Feature 1 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-aqua)',
              flexShrink: 0
            }}>
              <Radio size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Photo + Voice Stories
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                Record live audio narration over your travel photos & daily memories.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)',
              flexShrink: 0
            }}>
              <Users size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Intimate Listeners Circle
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                Connect directly with family and close friends without public distraction.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              flexShrink: 0
            }}>
              <Lock size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Voice Replies & Reactions
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                Reply back with audio voice comments that play directly on posts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="primary-btn"
            style={{
              padding: '15px',
              fontSize: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <span>Get Started with Email OTP</span>
            <ArrowRight size={18} />
          </button>

          <button 
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              color: 'var(--text-primary)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Log In to Your Voice Channel
          </button>
        </div>

      </div>
    </div>
  );
}
