import React, { useState } from 'react';
import { Search, Sparkles, Flame, Volume2, Plus } from 'lucide-react';
import { sampleVoiceStories, trendingHashtags } from '../utils/initialData';
import { useApp } from '../context/AppContext';

export default function ExploreView() {
  const { posts, setIsRecorderOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHashtags = trendingHashtags.filter(h => 
    h.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '16px' }}>
      {/* Search Input */}
      <div style={{
        position: 'relative',
        marginBottom: '20px'
      }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text"
          placeholder="Search voice topics, #hashtags, creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-input-field"
          style={{ paddingLeft: '42px', margin: 0, borderRadius: 'var(--radius-full)' }}
        />
      </div>

      {/* Voice Stories Carousel */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            🎙️ Voice Stories
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-aqua)', fontWeight: '700' }}>
            24h Audio Drops
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none'
        }}>
          {/* Add story item */}
          <div 
            onClick={() => setIsRecorderOpen(true)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(0,242,254,0.15)',
              border: '2px dashed var(--accent-aqua)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-aqua)'
            }}>
              <Plus size={24} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Add Voice</span>
          </div>

          {sampleVoiceStories.map((st) => (
            <div key={st.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                padding: '2px',
                background: st.hasUnheard ? 'var(--gradient-voice)' : 'rgba(255,255,255,0.2)'
              }}>
                <img src={st.avatar} alt={st.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontWeight: '600' }}>{st.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Audio Topics */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <Flame size={18} color="var(--accent-aqua)" />
          <span style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            Trending Voice Channels
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredHashtags.map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-card-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <Volume2 size={14} color="var(--text-muted)" />
              </div>
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {item.tag}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Discover Grid */}
      <div>
        <span style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', display: 'block', marginBottom: '12px' }}>
          Explore Popular VoiceDrops
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {posts.map((p) => (
            <div 
              key={p.id}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <img src={p.imageUrl} alt={p.voiceCaptionTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>@{p.creator.username}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-pink)' }}>🎙️ {p.audioDuration}s audio</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
