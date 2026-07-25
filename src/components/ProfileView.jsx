import React, { useState } from 'react';
import { Play, Pause, Mic, Grid, Bookmark, Volume2, CheckCircle2, Share2, Settings, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostCard from './PostCard';
import { speakCaptionText } from '../utils/audioUtils';

export default function ProfileView() {
  const { user, posts, themeMode, setThemeMode } = useApp();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'audio' | 'bookmarks'
  const [isPlayingBio, setIsPlayingBio] = useState(false);

  const bookmarkedPosts = posts.filter(p => p.isBookmarked);

  const handlePlayVoiceBio = () => {
    if (!isPlayingBio) {
      setIsPlayingBio(true);
      speakCaptionText(user.voiceBioTranscript);
      setTimeout(() => setIsPlayingBio(false), user.voiceBioDuration * 1000);
    } else {
      setIsPlayingBio(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  return (
    <div style={{ paddingBottom: '30px' }}>
      {/* Profile Header Container */}
      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Avatar Ring */}
        <div className="avatar-ring has-voice" style={{ width: '92px', height: '92px', marginBottom: '14px' }}>
          <img src={user.avatar} alt={user.name} className="avatar-img" />
        </div>

        {/* Creator Name & Username */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            {user.name}
          </h2>
          <CheckCircle2 size={18} className="verified-badge" fill="var(--accent-aqua)" color="#070c14" />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '16px' }}>
          @{user.username}
        </span>

        {/* Spacious Voice Bio Card */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(0,242,254,0.12) 0%, rgba(2,132,199,0.06) 100%)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <button 
            onClick={handlePlayVoiceBio}
            style={{
              width: '46px',
              height: '46px',
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
            title="Listen to Voice Bio"
          >
            {isPlayingBio ? <Pause size={20} fill="#0f172a" color="#0f172a" /> : <Play size={20} fill="#0f172a" color="#0f172a" style={{ marginLeft: '2px' }} />}
          </button>

          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--accent-aqua)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
              <Mic size={13} /> VOICE BIO ({user.voiceBioDuration}s)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.3' }}>
              "{user.voiceBioTranscript}"
            </div>
          </div>
        </div>

        {/* User Bio Text */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '22px', maxWidth: '340px', lineHeight: '1.4' }}>
          {user.bio}
        </p>

        {/* Spacious, High-Contrast Profile Stats Box */}
        <div style={{
          display: 'flex',
          justify: 'space-around',
          alignItems: 'center',
          width: '100%',
          padding: '16px 12px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {posts.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              VoiceDrops
            </span>
          </div>

          <div style={{ width: '1px', height: '28px', background: 'var(--bg-card-border)' }} />

          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {user.followers.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Listeners
            </span>
          </div>

          <div style={{ width: '1px', height: '28px', background: 'var(--bg-card-border)' }} />

          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {user.following}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Following
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button className="primary-btn" style={{ flex: 1, padding: '12px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}>
            Edit Profile
          </button>
          <button style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--bg-card-border)',
            color: 'var(--text-primary)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Share2 size={18} />
          </button>
        </div>

        {/* App Settings Card (Theme Toggle placed inside Settings) */}
        <div style={{
          width: '100%',
          marginTop: '16px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--accent-aqua)" />
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>App Theme Settings</span>
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.06)', padding: '3px', borderRadius: '20px', border: '1px solid var(--bg-card-border)' }}>
            <button 
              onClick={() => setThemeMode('light')}
              style={{
                background: themeMode === 'light' ? 'var(--gradient-aqua)' : 'transparent',
                color: themeMode === 'light' ? '#0f172a' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sun size={13} />
              <span>White</span>
            </button>
            <button 
              onClick={() => setThemeMode('dark')}
              style={{
                background: themeMode === 'dark' ? 'var(--gradient-aqua)' : 'transparent',
                color: themeMode === 'dark' ? '#0f172a' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Moon size={13} />
              <span>Black</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacious Tabs Header */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--bg-card-border)',
        marginBottom: '16px',
        padding: '0 8px'
      }}>
        <button 
          onClick={() => setActiveTab('grid')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'grid' ? '3px solid var(--accent-aqua)' : 'none',
            color: activeTab === 'grid' ? 'var(--accent-aqua)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <Grid size={18} />
          <span>Posts</span>
        </button>

        <button 
          onClick={() => setActiveTab('audio')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'audio' ? '3px solid var(--accent-aqua)' : 'none',
            color: activeTab === 'audio' ? 'var(--accent-aqua)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <Volume2 size={18} />
          <span>Audio Feed</span>
        </button>

        <button 
          onClick={() => setActiveTab('bookmarks')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bookmarks' ? '3px solid var(--accent-aqua)' : 'none',
            color: activeTab === 'bookmarks' ? 'var(--accent-aqua)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <Bookmark size={18} />
          <span>Saved</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '0 8px' }}>
          {posts.map((p) => (
            <div key={p.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <img src={p.imageUrl} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {p.audioDuration > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'rgba(7,12,20,0.75)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.65rem'
                }}>
                  🎙️
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audio' && (
        <div>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div>
          {bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>
              No saved VoiceDrops yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
