import React from 'react';
import { Mic, Heart, UserPlus, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationsView() {
  const notifications = [
    {
      id: "n_1",
      type: "voice_comment",
      user: {
        name: "Sophia Chen",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
      },
      text: "dropped a 9s voice reply on your Yosemite post.",
      time: "10m ago",
      duration: "9s"
    },
    {
      id: "n_2",
      type: "like",
      user: {
        name: "Liam O'Connor",
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
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
      },
      text: "started following your voice channel.",
      time: "3h ago"
    }
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', marginBottom: '16px', fontSize: '1.2rem' }}>
        Voice Activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img src={n.user.avatar} alt={n.user.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: n.type === 'voice_comment' ? 'var(--accent-purple)' : n.type === 'like' ? 'var(--accent-pink)' : 'var(--accent-cyan)',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.6rem'
                }}>
                  {n.type === 'voice_comment' ? <Mic size={10} /> : n.type === 'like' ? <Heart size={10} fill="#fff" /> : <UserPlus size={10} />}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  <strong>{n.user.name}</strong> {n.text}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
            </div>

            {n.type === 'voice_comment' && (
              <button style={{
                background: 'var(--gradient-voice)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Play size={14} fill="#fff" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
