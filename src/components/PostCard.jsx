import React, { useState } from 'react';
import { Heart, Bookmark, Share2, CheckCircle2, Mic, ChevronDown, ChevronUp, MoreHorizontal, Trash2, Copy, VolumeX, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playVoiceAudioSound, stopVoiceAudioSound, formatRelativeTime } from '../utils/audioUtils';
import AudioWaveform from './AudioWaveform';

export default function PostCard({ post }) {
  const { 
    activePlayingId, 
    isPlaying, 
    playAudioPost, 
    toggleLike, 
    toggleBookmark,
    deletePost,
    deleteVoiceComment,
    sharePost,
    openCreatorProfile,
    openCommentModalForPost,
    showToast
  } = useApp();

  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showVoiceComments, setShowVoiceComments] = useState(false);
  const [playingCommentId, setPlayingCommentId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [expandedCommentTranscripts, setExpandedCommentTranscripts] = useState({});
  const [, setTick] = useState(0);

  // Auto-refresh relative time display every 15 seconds
  React.useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentPlaying = activePlayingId === post.id && isPlaying;

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      toggleLike(post.id);
    }
  };

  const handleCopyTranscript = () => {
    if (post.voiceTranscript) {
      navigator.clipboard?.writeText?.(post.voiceTranscript);
      showToast("Voice transcript copied to clipboard! 📋");
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (window.confirm("Are you sure you want to delete this VoiceDrop?")) {
      deletePost(post.id);
    }
  };

  const toggleCommentTranscript = (commentId) => {
    setExpandedCommentTranscripts(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <article className="post-card" style={{ position: 'relative' }}>
      {/* Post Header */}
      <div className="post-header">
        <div className="creator-info" onClick={() => openCreatorProfile(post.creator)} style={{ cursor: 'pointer' }}>
          <div className="avatar-ring has-voice">
            <img src={post.creator.avatar} alt={post.creator.name} className="avatar-img" />
          </div>
          <div className="creator-names">
            <span className="creator-name">
              {post.creator.name}
            </span>
            <span className="creator-username">@{post.creator.username} • {formatRelativeTime(post.createdAt || post.postedTime)}</span>
          </div>
        </div>

        {/* Three Dots Menu Toggle */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'var(--bg-glass)',
              border: 'none',
              color: 'var(--text-muted)',
              padding: '6px 10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Options"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Options Popover Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '36px',
              right: '0',
              background: 'var(--bg-card)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              width: '180px',
              boxShadow: 'var(--shadow-card)',
              zIndex: 80,
              backdropFilter: 'blur(16px)'
            }}>
              <button 
                onClick={() => { setShowMenu(false); sharePost(post); }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Share2 size={15} color="var(--accent-aqua)" />
                <span>Share VoiceDrop</span>
              </button>

              <button 
                onClick={handleCopyTranscript}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Copy size={15} color="var(--text-secondary)" />
                <span>Copy Transcript</span>
              </button>

              <div style={{ height: '1px', background: 'var(--bg-card-border)', margin: '4px 0' }} />

              <button 
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(244,63,94,0.1)',
                  border: 'none',
                  color: 'var(--accent-rose)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Trash2 size={15} color="var(--accent-rose)" />
                <span>Delete Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Photo Container */}
      <div className="post-image-box" onDoubleClick={handleDoubleTap}>
        <img src={post.imageUrl} alt="VoiceDrop Story" className="post-image" />
        {post.audioDuration > 0 && (
          <div className="voice-badge-overlay">
            <span className="pulse-red-dot" />
            <Mic size={13} />
            <span>{post.audioDuration}s Voice Caption</span>
          </div>
        )}
      </div>

      {/* Voice Audio Waveform Player (Optional) */}
      {post.audioDuration > 0 && (
        <AudioWaveform
          postId={post.id}
          waveform={post.waveform}
          duration={post.audioDuration}
          isPlaying={isCurrentPlaying}
          onTogglePlay={() => playAudioPost(post.id)}
          title={post.voiceCaptionTitle}
          transcript={post.voiceTranscript}
        />
      )}

      {/* Optional Text Caption */}
      {post.optionalTextCaption && (
        <div style={{ padding: '10px 16px 4px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)', marginRight: '6px' }}>
            @{post.creator.username}
          </span>
          {showFullCaption ? post.optionalTextCaption : `${post.optionalTextCaption.slice(0, 80)}...`}
          {post.optionalTextCaption.length > 80 && (
            <button 
              onClick={() => setShowFullCaption(!showFullCaption)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-aqua)', fontSize: '0.78rem', marginLeft: '6px', cursor: 'pointer' }}
            >
              {showFullCaption ? 'less' : 'more'}
            </button>
          )}
        </div>
      )}

      {/* Action Bar (Like, Voice Comment, Share, Bookmark) */}
      <div className="post-actions">
        <div className="action-left">
          <button 
            className={`action-btn ${post.isLiked ? 'liked' : ''}`}
            onClick={() => toggleLike(post.id)}
          >
            <Heart size={22} fill={post.isLiked ? 'var(--accent-rose)' : 'none'} color={post.isLiked ? 'var(--accent-rose)' : 'currentColor'} />
            <span>{post.likes}</span>
          </button>

          <button 
            className="action-btn"
            onClick={() => openCommentModalForPost(post.id)}
          >
            <Mic size={20} color="var(--accent-aqua)" />
            <div className="voice-comment-chip">
              <span>{post.voiceComments.length} Voice Replies</span>
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="action-btn" onClick={() => sharePost(post)} title="Share VoiceDrop">
            <Share2 size={20} />
          </button>
          <button className="action-btn" onClick={() => toggleBookmark(post.id)} title="Save">
            <Bookmark size={20} fill={post.isBookmarked ? 'var(--accent-aqua)' : 'none'} color={post.isBookmarked ? 'var(--accent-aqua)' : 'currentColor'} />
          </button>
        </div>
      </div>

      {/* Voice Comments Drawer / Toggle */}
      {post.voiceComments.length > 0 && (
        <div style={{ padding: '0 16px 12px 16px' }}>
          <button 
            onClick={() => setShowVoiceComments(!showVoiceComments)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {showVoiceComments ? <ChevronUp size={14} color="var(--accent-aqua)" /> : <ChevronDown size={14} color="var(--accent-aqua)" />}
            {showVoiceComments ? 'Hide Voice Comments' : `Listen to ${post.voiceComments.length} Voice Responses`}
          </button>

          {showVoiceComments && (
            <div className="voice-comments-preview" style={{ marginTop: '8px' }}>
              {post.voiceComments.map((vc) => (
                <div key={vc.id} className="vc-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div className="vc-left">
                      <img src={vc.user.avatar} alt={vc.user.name} className="vc-avatar" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-primary)' }}>{vc.user.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{vc.duration || 8}s voice reply</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        className="vc-play-btn"
                        onClick={() => {
                          if (playingCommentId === vc.id) {
                            setPlayingCommentId(null);
                            stopVoiceAudioSound();
                          } else {
                            setPlayingCommentId(vc.id);
                            playVoiceAudioSound({
                              audioUrl: vc.audioUrl,
                              duration: vc.duration || 8,
                              onEnded: () => setPlayingCommentId(null)
                            });
                          }
                        }}
                        title={playingCommentId === vc.id ? "Pause Voice Reply" : "Play Voice Reply"}
                      >
                        {playingCommentId === vc.id ? <Pause size={14} fill="#0f172a" color="#0f172a" /> : <Mic size={14} />}
                      </button>

                      <button 
                        onClick={() => deleteVoiceComment(post.id, vc.id)}
                        style={{
                          background: 'rgba(244,63,94,0.1)',
                          border: 'none',
                          color: 'var(--accent-rose)',
                          padding: '6px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Voice Reply"
                      >
                        <Trash2 size={13} color="var(--accent-rose)" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Voice Response Spoken Transcript */}
                  {vc.transcript && (
                    <div style={{ width: '100%', marginTop: '2px' }}>
                      <button 
                        onClick={() => toggleCommentTranscript(vc.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        {expandedCommentTranscripts[vc.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        <span>{expandedCommentTranscripts[vc.id] ? 'Hide Transcript' : 'Read Transcript'}</span>
                      </button>

                      {expandedCommentTranscripts[vc.id] && (
                        <div style={{
                          marginTop: '4px',
                          fontSize: '0.76rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          background: 'var(--bg-glass)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          borderLeft: '2px solid var(--accent-aqua)',
                          lineHeight: '1.3'
                        }}>
                          "{vc.transcript}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
