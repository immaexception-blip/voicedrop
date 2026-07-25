import React, { useState } from 'react';
import { Mic, Heart, UserPlus, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playVoiceAudioSound, stopVoiceAudioSound } from '../utils/audioUtils';

export default function NotificationsView() {
  const { showToast, openCreatorProfile } = useApp();
  const [playingId, setPlayingId] = useState(null);

  const notifications = [
    {
      id: "n_1",
      type: "voice_comment",
      user: {
        name: "Sophia Chen",
        username: "sophiac",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
      },
      text: "dropped a 9s voice reply on your Yosemite story.",
      time: "10m ago",
      duration: 9,
      transcript: "This is breathtaking Sophia! That voice intro gave me literal goosebumps."
    },
    {
      id: "n_2",
      type: "like",
      user: {
        name: "Liam O'Connor",
        username: "liam_audio",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
      },
      text: "liked your Tokyo Jazz Bar VoiceDrop.",
      time: "1h ago"
    },
    {
      id: "n_3",
      type: "follow",
      user: {
        name: "Aria Thorne",
        username: "aria_stories",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
      },
      text: "started listening to your voice channel.",
      time: "3h ago"
    },
    {
      id: "n_4",
      type: "voice_comment",
      user: {
        name: "Marcus Vance",
        username: "marcus_voice",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
      },
      text: "replied with a 6s audio reaction.",
      time: "5h ago",
      duration: 6,
      transcript: "Acoustic vibes and raw guitar notes straight from Camden!"
    }
  ];

  const handleTogglePlayNotificationVoice = (n) => {
    if (playingId === n.id) {
      setPlayingId(null);
      stopVoiceAudioSound();
    } else {
      setPlayingId(n.id);
      playVoiceAudioSound({
        transcript: n.transcript,
        duration: n.duration || 8,
        onEnded: () => setPlayingId(null)
      });
      showToast(`Playing voice reply from ${n.user.name} 🎙️`);
    }
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '30px' }}>
      <h3 style={{
        fontFamily: 'Outfit, sans-serif',
        fontWeight: '800',
        marginBottom: '16px',
        fontSize: '1.2rem',
        color: 'var(--text-primary)'
      }}>
        Voice Activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map((n) => (
          <div 
            key={n.id} 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              boxShadow: 'var(--shadow-card)',
              gap: '12px'
            }}
          >
            <div 
              onClick={() => openCreatorProfile(n.user)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, cursor: 'pointer' }}
            >
              {/* Avatar Container with Pixel-Perfect Badge Alignment */}
              <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
                <img 
                  src={n.user.avatar} 
                  alt={n.user.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
                
                {/* Badge Icon Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: n.type === 'voice_comment' 
                    ? 'var(--gradient-aqua)' 
                    : n.type === 'like' 
                    ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: '2px solid var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: n.type === 'voice_comment' ? '#0f172a' : '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  {n.type === 'voice_comment' && <Mic size={11} strokeWidth={2.5} />}
                  {n.type === 'like' && <Heart size={10} fill="#ffffff" color="#ffffff" />}
                  {n.type === 'follow' && <UserPlus size={10} strokeWidth={2.5} />}
                </div>
              </div>

              {/* Activity Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.35', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong>{n.user.name}</strong> {n.text}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px', display: 'block' }}>
                  {n.time}
                </span>
              </div>
            </div>

            {/* Play Button for Voice Activity */}
            {n.type === 'voice_comment' && (
              <button 
                onClick={() => handleTogglePlayNotificationVoice(n)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gradient-aqua)',
                  border: 'none',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)',
                  flexShrink: 0
                }}
                title={playingId === n.id ? "Pause Voice Reply" : "Play Voice Reply"}
              >
                {playingId === n.id ? (
                  <Pause size={15} fill="#0f172a" color="#0f172a" />
                ) : (
                  <Play size={15} fill="#0f172a" color="#0f172a" style={{ marginLeft: '2px' }} />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
