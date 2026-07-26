import React, { createContext, useContext, useState, useEffect } from 'react';
import { samplePosts, currentUser, initialListeners, initialFollowing, DEFAULT_GREY_AVATAR } from '../utils/initialData';
import { speakCaptionText, playVoiceAudioSound, stopVoiceAudioSound } from '../utils/audioUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('voicedrop_posts');
    return saved ? JSON.parse(saved) : samplePosts;
  });

  const [listenersList, setListenersList] = useState(() => {
    const saved = localStorage.getItem('voicedrop_listeners');
    return saved ? JSON.parse(saved) : initialListeners;
  });

  const [followingList, setFollowingList] = useState(() => {
    const saved = localStorage.getItem('voicedrop_following');
    return saved ? JSON.parse(saved) : initialFollowing;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('voicedrop_user');
    return saved ? JSON.parse(saved) : currentUser;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('voicedrop_user');
    return !!saved;
  });

  // Local registry of registered user profiles (synced with Supabase)
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('voicedrop_users_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ----------------------------------------------------
  // REAL DATABASE LOGIN VALIDATION
  // ----------------------------------------------------
  const loginWithEmail = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Supabase DB profiles table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (data) {
        const dbUser = {
          id: data.id,
          name: data.name,
          username: data.username,
          avatar: data.avatar || DEFAULT_GREY_AVATAR,
          bio: data.bio || "🎙️ Documenting moments with real voice notes.",
          voiceBioDuration: data.voice_bio_duration || 8,
          voiceBioTranscript: data.voice_bio_transcript || `Hi! Welcome to @${data.username}'s voice channel!`,
          followers: listenersList.length,
          following: followingList.length,
          postsCount: 0,
          email: cleanEmail
        };

        setUser(dbUser);
        setIsLoggedIn(true);
        localStorage.setItem('voicedrop_user', JSON.stringify(dbUser));
        setIsAuthModalOpen(false);
        showToast(`Welcome back @${data.username}! 👋`);
        return { success: true };
      }
    } catch (e) {
      console.warn("Supabase query error:", e);
    }

    // 2. Check local registered users DB registry
    const existingDbAccount = usersDb.find(u => u.email === cleanEmail);
    if (existingDbAccount) {
      setUser(existingDbAccount);
      setIsLoggedIn(true);
      localStorage.setItem('voicedrop_user', JSON.stringify(existingDbAccount));
      setIsAuthModalOpen(false);
      showToast(`Welcome back @${existingDbAccount.username}! 👋`);
      return { success: true };
    }

    // 3. NO ACCOUNT FOUND -> REJECT LOGIN
    showToast("No account found with this email. Please Sign Up first ❌");
    return { success: false, error: "Account not found. Please sign up." };
  };

  // ----------------------------------------------------
  // REAL DATABASE ACCOUNT CREATION
  // ----------------------------------------------------
  const signUpWithEmail = async ({ email, password, name, username }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    // Check if username/email already taken in DB
    const existing = usersDb.find(u => u.email === cleanEmail || u.username === cleanUsername);
    if (existing) {
      showToast("Account already exists with this email or username. Please Log In.");
      return { success: false, error: "Account already exists." };
    }

    const newUserId = `user_${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: name,
      username: cleanUsername,
      avatar: DEFAULT_GREY_AVATAR,
      bio: "🎙️ Sharing authentic voice stories.",
      voiceBioDuration: 6,
      voiceBioTranscript: `Hey everyone, I'm ${name}! Welcome to my voice channel.`,
      followers: 0,
      following: 0,
      postsCount: 0,
      email: cleanEmail
    };

    // 1. Insert into Supabase DB profiles table
    try {
      await supabase.from('profiles').insert([{
        id: newUserId,
        name: name,
        username: cleanUsername,
        avatar: DEFAULT_GREY_AVATAR,
        bio: "🎙️ Sharing authentic voice stories.",
        email: cleanEmail
      }]);
    } catch (e) {
      console.warn("Supabase profile insert error:", e);
    }

    // 2. Save to local users DB registry & active session
    const updatedUsersDb = [...usersDb, newUser];
    setUsersDb(updatedUsersDb);
    localStorage.setItem('voicedrop_users_db', JSON.stringify(updatedUsersDb));

    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('voicedrop_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    showToast(`Account created for @${cleanUsername}! 🎉`);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('voicedrop_user');
    setIsLoggedIn(false);
    setUser(currentUser);
    showToast("Logged out successfully 👋");
  };

  const removeListener = (id, username) => {
    setListenersList(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('voicedrop_listeners', JSON.stringify(updated));
      return updated;
    });
  };

  const unfollowUser = (id, username) => {
    setFollowingList(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('voicedrop_following', JSON.stringify(updated));
      return updated;
    });
  };

  const [viewingCreator, setViewingCreator] = useState(null);

  const openCreatorProfile = (creatorData) => {
    if (!creatorData) return;
    if (creatorData.id === user.id || creatorData.username === user.username || creatorData.id === "user_me") {
      setCurrentTab('profile');
      setViewingCreator(null);
      return;
    }
    setViewingCreator(creatorData);
  };

  const closeCreatorProfile = () => {
    setViewingCreator(null);
  };

  useEffect(() => {
    try {
      localStorage.setItem('voicedrop_user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updatedFields };
      
      // Update creator details on all posts created by this user across feed & profile
      setPosts(currentPosts => currentPosts.map(p => {
        if (p.creator.id === updatedUser.id || p.creator.username === prev.username || p.creator.id === "user_me") {
          return {
            ...p,
            creator: {
              ...p.creator,
              name: updatedUser.name,
              username: updatedUser.username,
              avatar: updatedUser.avatar
            }
          };
        }
        return p;
      }));

      return updatedUser;
    });
    showToast("Profile updated successfully! ✨");
  };
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'search' | 'notifications' | 'profile'
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
      likes: 0,
      isLiked: false,
      bookmarks: 0,
      isBookmarked: false,
      postedTime: "Just now",
      createdAt: Date.now(),
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

  // Delete Voice Comment from a Post
  const deleteVoiceComment = (postId, commentId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          voiceComments: p.voiceComments.filter(vc => vc.id !== commentId)
        };
      }
      return p;
    }));
    showToast("Voice reply deleted 🗑️");
  };

  const openCommentModalForPost = (postId) => {
    setTargetCommentPostId(postId);
    setIsCommentModalOpen(true);
  };

  return (
    <AppContext.Provider value={{
      posts,
      user,
      isLoggedIn,
      setIsLoggedIn,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginWithEmail,
      signUpWithEmail,
      logout,
      listenersList,
      followingList,
      removeListener,
      unfollowUser,
      viewingCreator,
      openCreatorProfile,
      closeCreatorProfile,
      updateUserProfile,
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
      deleteVoiceComment,
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
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
