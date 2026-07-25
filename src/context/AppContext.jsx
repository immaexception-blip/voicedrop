import React, { createContext, useContext, useState, useEffect } from 'react';
import { samplePosts, currentUser, trendingHashtags } from '../utils/initialData';
import { speakCaptionText, playVoiceAudioSound, stopVoiceAudioSound } from '../utils/audioUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('voicedrop_posts');
    return saved ? JSON.parse(saved) : samplePosts;
  });

  const [user, setUser] = useState(currentUser);
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'explore' | 'notifications' | 'profile'
  const [activePlayingId, setActivePlayingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [deviceFrame, setDeviceFrame] = useState('ios');
  const [themeMode, setThemeMode] = useState('light');
  
  // Apply data-theme attribute to root document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Modals
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [targetCommentPostId, setTargetCommentPostId] = useState(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);
  
  // Active playing audio state
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  
  // Notification count
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Save posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('voicedrop_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn("Storage write limit reached", e);
    }
  }, [posts]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Like
  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  // Toggle Bookmark
  const toggleBookmark = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isBookmarked = !p.isBookmarked;
        showToast(isBookmarked ? "VoiceDrop saved to bookmarks! 🔖" : "Removed from bookmarks");
        return { ...p, isBookmarked };
      }
      return p;
    }));
  };

  // Delete Post
  const deletePost = (postId) => {
    if (activePlayingId === postId) {
      stopAudio();
    }
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast("VoiceDrop post deleted 🗑️");
  };

  // Share Post
  const sharePost = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.voiceCaptionTitle || "VoiceDrop Post",
        text: `Listen to this VoiceDrop story by @${post.creator.username}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast("VoiceDrop link copied to clipboard! 🚀");
    }
  };

  // Play or Pause Audio Post
  const playAudioPost = (postId) => {
    if (activePlayingId === postId) {
      if (isPlaying) {
        stopAudio();
      } else {
        const targetPost = posts.find(p => p.id === postId);
        if (targetPost) {
          setIsPlaying(true);
          playVoiceAudioSound({
            audioUrl: targetPost.audioUrl,
            transcript: targetPost.voiceTranscript,
            duration: targetPost.audioDuration || 10,
            onEnded: () => {
              setIsPlaying(false);
              setActivePlayingId(null);
            },
            onProgress: (pct) => setAudioProgress(pct)
          });
        }
      }
    } else {
      stopAudio();
      const targetPost = posts.find(p => p.id === postId);
      if (targetPost) {
        setActivePlayingId(postId);
        setIsPlaying(true);
        setAudioProgress(0);

        playVoiceAudioSound({
          audioUrl: targetPost.audioUrl,
          transcript: targetPost.voiceTranscript,
          duration: targetPost.audioDuration || 10,
          onEnded: () => {
            setIsPlaying(false);
            setActivePlayingId(null);
          },
          onProgress: (pct) => setAudioProgress(pct)
        });
      }
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    setActivePlayingId(null);
    stopVoiceAudioSound();
  };

  // Add New VoiceDrop Post
  const addNewPost = (newPostData) => {
    const newPost = {
      id: `post_${Date.now()}`,
      creator: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        verified: true
      },
      imageUrl: newPostData.imageUrl || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80",
      audioUrl: newPostData.audioUrl || null,
      audioDuration: newPostData.duration || 12,
      voiceCaptionTitle: newPostData.title || "Voice Note Story",
      voiceTranscript: newPostData.transcript || "Here is my recorded voice caption for this moment!",
      optionalTextCaption: newPostData.textCaption || "",
      likes: 1,
      isLiked: true,
      bookmarks: 0,
      isBookmarked: false,
      postedTime: "Just now",
      tags: newPostData.tags || ["#VoiceDrop"],
      waveform: newPostData.waveform || [30, 45, 60, 80, 95, 70, 50, 65, 85, 90, 70, 40, 60, 80, 90, 60, 35],
      voiceComments: []
    };

    setPosts([newPost, ...posts]);
    setUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setIsRecorderOpen(false);
    setCurrentTab('feed');
    showToast("VoiceDrop published to feed! 🎙️✨");
  };

  // Add Voice Comment to a Post
  const addVoiceComment = (postId, commentData) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newVc = {
          id: `vc_${Date.now()}`,
          user: {
            name: user.name,
            avatar: user.avatar
          },
          duration: commentData.duration || 8,
          transcript: commentData.transcript || "Recorded voice reaction!",
          audioUrl: commentData.audioUrl || null,
          timeAgo: "Just now",
          likes: 0
        };
        return {
          ...p,
          voiceComments: [newVc, ...p.voiceComments]
        };
      }
      return p;
    }));
    setIsCommentModalOpen(false);
    showToast("Voice reply posted! 💬");
  };

  const openCommentModalForPost = (postId) => {
    setTargetCommentPostId(postId);
    setIsCommentModalOpen(true);
  };

  return (
    <AppContext.Provider value={{
      posts,
      user,
      currentTab,
      setCurrentTab,
      activePlayingId,
      isPlaying,
      playbackSpeed,
      setPlaybackSpeed,
      playAudioPost,
      stopAudio,
      toggleLike,
      toggleBookmark,
      deletePost,
      sharePost,
      deviceFrame,
      setDeviceFrame,
      themeMode,
      setThemeMode,
      isRecorderOpen,
      setIsRecorderOpen,
      isCommentModalOpen,
      setIsCommentModalOpen,
      targetCommentPostId,
      openCommentModalForPost,
      addNewPost,
      addVoiceComment,
      audioProgress,
      setAudioProgress,
      currentAudioTime,
      setCurrentAudioTime,
      unreadNotifications,
      setUnreadNotifications,
      trendingHashtags,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
