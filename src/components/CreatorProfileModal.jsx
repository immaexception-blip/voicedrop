import React, { useState } from 'react';
import { X, Play, Pause, Mic, Volume2, Share2, ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostCard from './PostCard';
import { speakCaptionText } from '../utils/audioUtils';

export default function CreatorProfileModal() {
  const { viewingCreator, closeCreatorProfile, posts, showToast } = useApp();
  const [isPlayingBio, setIsPlayingBio] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState(null);

  if (!viewingCreator) return null;

  // Find all posts created by this specific creator
  const creatorPosts = posts.filter(p => 
    p.creator.id === viewingCreator.id || 
    p.creator.username === viewingCreator.username ||
    p.creator.name.toLowerCase() === viewingCreator.name.toLowerCase()
  );

  // Fallback photo list if creator has no posts in sample state
  const displayPosts = creatorPosts.length > 0 ? creatorPosts : [
    {
      id: `c_post_${viewingCreator.id || 1}`,
      creator: {
        id: viewingCreator.id || 'c_1',
        name: viewingCreator.name,
        username: viewingCreator.username,
        avatar: viewingCreator.avatar
      },
      imageUrl: viewingCreator.avatar || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      audioDuration: viewingCreator.voiceBioDuration || 12,
      voiceCaptionTitle: `${viewingCreator.name}'s Voice Story`,
      voiceTranscript: viewingCreator.voiceBioTranscript || "Welcome to my VoiceDrop channel!",
      optionalTextCaption: viewingCreator.bio || "Sharing audio stories with photos.",
      likes: 1420,
      isLiked: false,
      bookmarks: 310,
      isBookmarked: false,
      postedTime: "3 hours ago",
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      waveform: [30, 45, 60, 80, 95, 70, 50, 65, 85, 90, 70, 40, 60, 80, 90, 60, 35],
      voiceComments: []
    }
  ];

  const handlePlayVoiceBio = () => {
    const transcript = viewingCreator.voiceBioTranscript || `Hi, I'm ${viewingCreator.name}. Welcome to my VoiceDrop channel.`;
    const duration = viewingCreator.voiceBioDuration || 8;

    if (!isPlayingBio) {
      setIsPlayingBio(true);
      speakCaptionText(transcript);
      setTimeout(() => setIsPlayingBio(false), duration * 1000);
    } else {
      setIsPlayingBio(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const toggleFollow = () => {
    const updated = !isFollowing;
    setIsFollowing(updated);
    showToast(updated ? `Following @${viewingCreator.username}!` : `Unfollowed @${viewingCreator.username}`);
  };

  const handleShareCreator = () => {
    const url = `${window.location.origin}/@${viewingCreator.username}`;
    if (navigator.share) {
      navigator.share({
        title: `${viewingCreator.name} on VoiceDrop`,
        text: `Listen to @${viewingCreator.username}'s voice stories on VoiceDrop!`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(url);
      showToast("Creator profile link copied to clipboard!");
    }
  };

  const getTimelinePostsStartingFrom = (targetList, clickedId) => {
    const idx = targetList.findIndex(p => p.id === clickedId);
    if (idx === -1) return targetList;
    return [...targetList.slice(idx), ...targetList.slice(0, idx)];
  };

  return (
    <div className="full-page-screen">
      {/* Header Bar */}
      <div className="full-page-header">
        <button 
          onClick={closeCreatorProfile}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={20} />
          <span style={{ fontWeight: '800', fontSize: '0.92rem' }}>Back</span>
        </button>

        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          @{viewingCreator.username}
        </span>

        <button 
          onClick={handleShareCreator}
          style={{ background: 'none', border: 'none', color: 'var(--accent-aqua)', cursor: 'pointer', padding: '4px' }}
          title="Share Profile"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Profile Body */}
      <div className="full-page-body" style={{ paddingBottom: '40px' }}>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Avatar */}
          <div className="avatar-ring" style={{ width: '90px', height: '90px', marginBottom: '12px' }}>
            <img src={viewingCreator.avatar} alt={viewingCreator.name} className="avatar-img" />
          </div>

          {/* Name & Username */}
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
            {viewingCreator.name}
          </h2>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '16px' }}>
            @{viewingCreator.username}
          </span>

          {/* Voice Bio Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.12) 0%, rgba(2,132,199,0.06) 100%)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            marginBottom: '18px',
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
                <Mic size={13} /> VOICE BIO ({viewingCreator.voiceBioDuration || 8}s)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.3' }}>
                "{viewingCreator.voiceBioTranscript || "Welcome to my VoiceDrop channel!"}"
              </div>
            </div>
          </div>

          {/* Bio Text */}
          {viewingCreator.bio && (
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '18px', maxWidth: '340px', lineHeight: '1.4' }}>
              {viewingCreator.bio}
            </p>
          )}

          {/* Follow Button */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '20px' }}>
            <button 
              onClick={toggleFollow}
              style={{
                flex: 1,
                background: isFollowing ? 'var(--bg-glass)' : 'var(--gradient-aqua)',
                color: isFollowing ? 'var(--text-primary)' : '#0f172a',
                border: isFollowing ? '1px solid var(--bg-card-border)' : 'none',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              <span>{isFollowing ? 'Following' : 'Follow Creator'}</span>
            </button>
          </div>

          {/* Stats Box */}
          <div style={{
            display: 'flex',
            justify: 'space-around',
            alignItems: 'center',
            width: '100%',
            padding: '14px 12px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ display: 'block', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {displayPosts.length}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                VoiceDrops
              </span>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ display: 'block', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {viewingCreator.followers ? (viewingCreator.followers / 1000).toFixed(1) + 'k' : '1.2k'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Listeners
              </span>
            </div>
          </div>
        </div>

        {/* Audio Feed Tab Header */}
        <div style={{
          borderBottom: '1px solid var(--bg-card-border)',
          marginBottom: '12px',
          padding: '0 16px 10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '800',
          fontSize: '0.9rem',
          color: 'var(--accent-aqua)'
        }}>
          <Volume2 size={18} />
          <span>Audio Feed</span>
        </div>

        {/* 3-Column Collated Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '0 8px' }}>
          {displayPosts.map((p) => (
            <div 
              key={p.id} 
              onClick={() => setSelectedPostForDetail({ post: p, list: displayPosts })}
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
          ))}
        </div>
      </div>

      {/* Detailed Feed View when thumbnail is clicked */}
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
    </div>
  );
}
