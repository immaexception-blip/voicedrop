import React, { useState } from 'react';
import { Play, Pause, Mic, Bookmark, Volume2, CheckCircle2, Share2, Settings, Sun, Moon, ArrowLeft, Copy, Send, Globe, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostCard from './PostCard';
import EditProfileModal from './EditProfileModal';
import ConnectionsModal from './ConnectionsModal';
import { speakCaptionText } from '../utils/audioUtils';

export default function ProfileView() {
  const { user, posts, listenersList, followingList, themeMode, setThemeMode, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('audio'); // 'audio' | 'bookmarks'
  const [isPlayingBio, setIsPlayingBio] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);
  const [connectionsTab, setConnectionsTab] = useState('listeners');

  const bookmarkedPosts = posts.filter(p => p.isBookmarked);

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/@${user.username}` : `https://voicedrop.app/@${user.username}`;
  const shareText = `Check out @${user.username}'s voice stories on VoiceDrop! 🎙️✨ ${profileUrl}`;

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

  const handleNativeShare = () => {
    setShowShareModal(false);
    if (navigator.share) {
      navigator.share({
        title: `${user.name} (@${user.username}) • VoiceDrop`,
        text: `Check out @${user.username}'s voice stories on VoiceDrop! 🎙️✨`,
        url: profileUrl
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    setShowShareModal(false);
    navigator.clipboard?.writeText?.(profileUrl);
    showToast("Profile link copied to clipboard! 📋");
  };

  const handleWhatsAppShare = () => {
    setShowShareModal(false);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTwitterShare = () => {
    setShowShareModal(false);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Reorder posts so clicked post appears first, followed by all timeline posts for continuous scrolling
  const getTimelinePostsStartingFrom = (targetList, clickedId) => {
    const idx = targetList.findIndex(p => p.id === clickedId);
    if (idx === -1) return targetList;
    return [...targetList.slice(idx), ...targetList.slice(0, idx)];
  };

  return (
    <div style={{ paddingBottom: '30px' }}>
      {/* Profile Header Container */}
      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Avatar Ring */}
        <div className="avatar-ring" style={{ width: '92px', height: '92px', marginBottom: '14px' }}>
          <img src={user.avatar} alt={user.name} className="avatar-img" />
        </div>

        {/* Creator Name & Username */}
        <div style={{ marginBottom: '4px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            {user.name}
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '16px' }}>
          @{user.username}
        </span>

        {/* Voice Bio Card */}
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

        {/* Profile Stats Box */}
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

          <div 
            onClick={() => {
              setConnectionsTab('listeners');
              setIsConnectionsOpen(true);
            }}
            style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
            title="Manage Listeners"
          >
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {listenersList.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-aqua)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Listeners
            </span>
          </div>

          <div 
            onClick={() => {
              setConnectionsTab('following');
              setIsConnectionsOpen(true);
            }}
            style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
            title="Manage Following"
          >
            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {followingList.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-aqua)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Following
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button 
            className="primary-btn" 
            onClick={() => setIsEditModalOpen(true)}
            style={{ flex: 1, padding: '12px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
          >
            Edit Profile
          </button>

          <button 
            onClick={() => setShowShareModal(true)}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              color: 'var(--text-primary)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Share Profile"
          >
            <Share2 size={18} color="var(--accent-aqua)" />
          </button>
        </div>
      </div>

      {/* Spacious 2-Tab Header: Audio Feed & Saved */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--bg-card-border)',
        marginBottom: '16px',
        padding: '0 8px'
      }}>
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
            fontSize: '0.9rem',
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
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Bookmark size={18} />
          <span>Saved</span>
        </button>
      </div>

      {/* Tab Content: Collated Grid View for Audio Feed */}
      {activeTab === 'audio' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '0 8px' }}>
          {posts.map((p) => (
            <div 
              key={p.id} 
              onClick={() => setSelectedPostForDetail({ post: p, list: posts })}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <img src={p.imageUrl} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Mic / Audio Badge Overlay */}
              {p.audioDuration > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'rgba(15,23,42,0.85)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '16px',
                  padding: '3px 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  <Mic size={11} color="var(--accent-aqua)" />
                  <span>{p.audioDuration}s</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '0 8px' }}>
          {bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPostForDetail({ post: p, list: bookmarkedPosts })}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <img src={p.imageUrl} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {p.audioDuration > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '16px',
                    padding: '3px 7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: '800'
                  }}>
                    <Mic size={11} color="var(--accent-aqua)" />
                    <span>{p.audioDuration}s</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '50px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>
              No saved VoiceDrops yet.
            </div>
          )}
        </div>
      )}

      {/* Instagram-Style Full Timeline Scrollable Feed (Opened when any thumbnail is tapped) */}
      {selectedPostForDetail && (
        <div className="full-page-screen">
          <div className="full-page-header">
            <button 
              onClick={() => setSelectedPostForDetail(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={20} />
              <span style={{ fontWeight: '800', fontSize: '0.92rem' }}>Posts Feed</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-aqua)', fontWeight: '800' }}>
              @{selectedPostForDetail.post.creator.username}
            </span>
          </div>

          <div className="full-page-body" style={{ padding: '0 0 40px 0' }}>
            {getTimelinePostsStartingFrom(selectedPostForDetail.list, selectedPostForDetail.post.id).map(p => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {/* Share Profile Modal / Sheet */}
      {showShareModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowShareModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={20} color="var(--accent-aqua)" />
                <span className="modal-title">Share Profile</span>
              </div>
              <button className="close-btn" onClick={() => setShowShareModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={handleNativeShare}
                style={{
                  background: 'var(--gradient-aqua)',
                  color: '#0f172a',
                  border: 'none',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Send size={18} />
                <span>Share via Phone Apps (WhatsApp, IG Stories...)</span>
              </button>

              <button 
                onClick={handleWhatsAppShare}
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>💬 Share directly to WhatsApp</span>
              </button>

              <button 
                onClick={handleTwitterShare}
                style={{
                  background: 'rgba(14, 165, 233, 0.15)',
                  color: '#0ea5e9',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>🐦 Share to Twitter / X</span>
              </button>

              <button 
                onClick={handleCopyLink}
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--bg-card-border)',
                  color: 'var(--text-primary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Copy size={16} />
                <span>Copy Profile Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Interactive Manage Connections Screen (Listeners & Following) */}
      <ConnectionsModal
        isOpen={isConnectionsOpen}
        onClose={() => setIsConnectionsOpen(false)}
        initialTab={connectionsTab}
      />
    </div>
  );
}
