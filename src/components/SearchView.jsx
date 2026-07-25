import React, { useState } from 'react';
import { Search, UserCheck, UserPlus, Mic, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakCaptionText } from '../utils/audioUtils';

const featuredCreators = [
  {
    id: "creator_1",
    name: "Sophia Chen",
    username: "sophiac",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bio: "Alpine photographer & early riser. Capturing dawn voices in mountain valleys.",
    voiceBioDuration: 8,
    voiceBioTranscript: "Hi! I'm Sophia. Listen to my daily morning mountain soundscapes.",
    followers: 12400,
    isFollowing: false
  },
  {
    id: "creator_2",
    name: "Liam O'Connor",
    username: "liam_audio",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bio: "Late night jazz collector & city audio storyteller. Shinjuku to NYC.",
    voiceBioDuration: 12,
    voiceBioTranscript: "Hey, welcome to my midnight voice notes. Recorded in rainy jazz bars.",
    followers: 8900,
    isFollowing: true
  },
  {
    id: "creator_3",
    name: "Aria Thorne",
    username: "aria_stories",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    bio: "Voice meditation guide & coast lover. 15-second ocean resets.",
    voiceBioDuration: 10,
    voiceBioTranscript: "Take a deep breath. Let the ocean wave audio clear your mind.",
    followers: 15600,
    isFollowing: false
  },
  {
    id: "creator_4",
    name: "Marcus Vance",
    username: "marcus_voice",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    bio: "Street musician & podcaster in London.",
    voiceBioDuration: 6,
    voiceBioTranscript: "Acoustic vibes and raw guitar notes straight from Camden.",
    followers: 6400,
    isFollowing: false
  },
  {
    id: "creator_5",
    name: "Elena Rostova",
    username: "elena_travel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    bio: "Solo traveler documenting world cultures with authentic ambient voice.",
    voiceBioDuration: 9,
    voiceBioTranscript: "Exploring 40+ countries one voice story at a time.",
    followers: 9200,
    isFollowing: true
  }
];

export default function SearchView() {
  const { showToast, openCreatorProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [creators, setCreators] = useState(featuredCreators);
  const [playingBioId, setPlayingBioId] = useState(null);

  const toggleFollow = (creatorId) => {
    setCreators(prev => prev.map(c => {
      if (c.id === creatorId) {
        const updated = !c.isFollowing;
        showToast(updated ? `Following @${c.username}! 🤝` : `Unfollowed @${c.username}`);
        return { ...c, isFollowing: updated };
      }
      return c;
    }));
  };

  const handlePlayVoiceBio = (c) => {
    if (playingBioId === c.id) {
      setPlayingBioId(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setPlayingBioId(c.id);
      speakCaptionText(c.voiceBioTranscript);
      setTimeout(() => setPlayingBioId(null), c.voiceBioDuration * 1000);
    }
  };

  const filteredCreators = creators.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '16px', paddingBottom: '30px' }}>
      {/* Search Input Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-full)',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <Search size={20} color="var(--accent-aqua)" />
          <input 
            type="text"
            placeholder="Search creators by name or @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.88rem',
              outline: 'none',
              fontWeight: '600'
            }}
          />
        </div>
      </div>

      {/* Creators List */}
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          {searchQuery ? `Search Results (${filteredCreators.length})` : "Featured Voice Creators"}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCreators.length > 0 ? (
            filteredCreators.map((c) => (
              <div 
                key={c.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--bg-card-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div 
                    onClick={() => openCreatorProfile(c)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  >
                    <img 
                      src={c.avatar} 
                      alt={c.name} 
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        @{c.username} • {(c.followers / 1000).toFixed(1)}k listeners
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button 
                    onClick={() => toggleFollow(c.id)}
                    style={{
                      background: c.isFollowing ? 'var(--bg-glass)' : 'var(--gradient-aqua)',
                      color: c.isFollowing ? 'var(--text-primary)' : '#0f172a',
                      border: c.isFollowing ? '1px solid var(--bg-card-border)' : 'none',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {c.isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                    <span>{c.isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                </div>

                {/* Creator Bio */}
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>
                  {c.bio}
                </p>

                {/* Mini Voice Bio Bar */}
                <div style={{
                  background: 'rgba(0,242,254,0.06)',
                  border: '1px solid var(--bg-card-border)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <button 
                    onClick={() => handlePlayVoiceBio(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--gradient-aqua)',
                      border: 'none',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {playingBioId === c.id ? <Pause size={13} fill="#0f172a" color="#0f172a" /> : <Play size={13} fill="#0f172a" color="#0f172a" style={{ marginLeft: '1px' }} />}
                  </button>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontStyle: 'italic', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{c.voiceBioTranscript}"
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>
              No creators found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
