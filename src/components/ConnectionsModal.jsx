import React, { useState } from 'react';
import { X, Search, UserCheck, UserMinus, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakCaptionText } from '../utils/audioUtils';

export default function ConnectionsModal({ isOpen, onClose, initialTab = 'listeners' }) {
  const { listenersList, followingList, removeListener, unfollowUser, openCreatorProfile } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab); // 'listeners' | 'following'
  const [searchQuery, setSearchQuery] = useState('');
  const [playingBioId, setPlayingBioId] = useState(null);

  if (!isOpen) return null;

  const handlePlayVoiceBio = (item) => {
    if (playingBioId === item.id) {
      setPlayingBioId(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setPlayingBioId(item.id);
      speakCaptionText(item.voiceBioTranscript);
      setTimeout(() => setPlayingBioId(null), (item.voiceBioDuration || 8) * 1000);
    }
  };

  const currentList = activeTab === 'listeners' ? listenersList : followingList;
  const filteredList = currentList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="full-page-screen">
      {/* Header */}
      <div className="full-page-header">
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={22} />
        </button>

        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          Manage Connections
        </span>

        <button 
          onClick={onClose}
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

      {/* Tabs Header: Listeners & Following */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--bg-card-border)',
        background: 'var(--bg-card)'
      }}>
        <button 
          onClick={() => setActiveTab('listeners')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'listeners' ? '3px solid var(--accent-aqua)' : 'none',
            color: activeTab === 'listeners' ? 'var(--accent-aqua)' : 'var(--text-muted)',
            fontWeight: '800',
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          {listenersList.length} Listeners
        </button>

        <button 
          onClick={() => setActiveTab('following')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'following' ? '3px solid var(--accent-aqua)' : 'none',
            color: activeTab === 'following' ? 'var(--accent-aqua)' : 'var(--text-muted)',
            fontWeight: '800',
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          {followingList.length} Following
        </button>
      </div>

      {/* Body */}
      <div className="full-page-body">
        {/* Search Field */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-full)',
          padding: '10px 16px',
          marginBottom: '16px'
        }}>
          <Search size={18} color="var(--accent-aqua)" />
          <input 
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.85rem',
              outline: 'none',
              fontWeight: '600'
            }}
          />
        </div>

        {/* User List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <div 
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--bg-card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div 
                  onClick={() => { onClose(); openCreatorProfile(item); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      @{item.username}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => handlePlayVoiceBio(item)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--gradient-aqua)',
                      border: 'none',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Voice Bio"
                  >
                    {playingBioId === item.id ? <Pause size={14} fill="#0f172a" color="#0f172a" /> : <Play size={14} fill="#0f172a" color="#0f172a" style={{ marginLeft: '1px' }} />}
                  </button>

                  {activeTab === 'listeners' ? (
                    <button 
                      onClick={() => removeListener(item.id, item.username)}
                      style={{
                        background: 'rgba(244,63,94,0.1)',
                        border: '1px solid rgba(244,63,94,0.3)',
                        color: 'var(--accent-rose)',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <UserMinus size={13} />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => unfollowUser(item.id, item.username)}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--bg-card-border)',
                        color: 'var(--text-primary)',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <UserCheck size={13} />
                      <span>Following</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>
              No {activeTab} found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
