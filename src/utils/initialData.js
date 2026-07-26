export const DEFAULT_GREY_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b' style='background-color:%23e2e8f0;'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const initialListeners = [
  {
    id: "lis_1",
    name: "Marcus Vance",
    username: "marcus_voice",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    bio: "Street musician & podcaster in London.",
    voiceBioDuration: 6,
    voiceBioTranscript: "Acoustic vibes and raw guitar notes straight from Camden."
  },
  {
    id: "lis_2",
    name: "Elena Rostova",
    username: "elena_travel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    bio: "Solo traveler documenting world cultures with ambient voice.",
    voiceBioDuration: 9,
    voiceBioTranscript: "Exploring 40+ countries one voice story at a time."
  },
  {
    id: "lis_3",
    name: "Chloe Bennett",
    username: "chloe_b",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    bio: "Jazz enthusiast & coffee lover.",
    voiceBioDuration: 7,
    voiceBioTranscript: "Always searching for deep vinyl sounds."
  }
];

export const initialFollowing = [
  {
    id: "fol_1",
    name: "Sophia Chen",
    username: "sophiac",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bio: "Alpine photographer & early riser. Dawn mountain voices.",
    voiceBioDuration: 8,
    voiceBioTranscript: "Hi! Listen to my daily morning mountain soundscapes."
  },
  {
    id: "fol_2",
    name: "Liam O'Connor",
    username: "liam_audio",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bio: "Late night jazz collector & city audio storyteller.",
    voiceBioDuration: 12,
    voiceBioTranscript: "Welcome to my midnight voice notes in rainy jazz bars."
  },
  {
    id: "fol_3",
    name: "Aria Thorne",
    username: "aria_stories",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    bio: "Voice meditation guide & coast lover.",
    voiceBioDuration: 10,
    voiceBioTranscript: "15-second ocean reset soundscapes."
  }
];

export const currentUser = {
  id: "user_me",
  name: "Alex Rivera",
  username: "alex_voice",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "🎙️ Documenting moments with real voice notes. Audio storyteller & photographer.",
  voiceBioDuration: 8,
  voiceBioTranscript: "Hey there! Welcome to my VoiceDrop. I share raw photo stories with my natural voice narrations.",
  followers: initialListeners.length,
  following: initialFollowing.length,
  postsCount: 24,
  badge: "Verified Voice Creator"
};

export const samplePosts = [
  {
    id: "post_1",
    creator: {
      id: "creator_1",
      name: "Sophia Chen",
      username: "sophiac",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      verified: true
    },
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    audioDuration: 18,
    voiceCaptionTitle: "Sunrise over Yosemite Valley - Listen to the morning breeze",
    voiceTranscript: "Good morning everyone! I hiked up here at 5:00 AM in the freezing fog. As the first light touched El Capitan, the whole valley lit up in golden amber. Take a deep breath and listen to this silence...",
    optionalTextCaption: "Worth every single freezing step of the 5 AM hike! 🏔️✨",
    likes: 1240,
    isLiked: false,
    bookmarks: 284,
    isBookmarked: false,
    postedTime: "2 hours ago",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    waveform: [25, 40, 65, 85, 90, 45, 30, 75, 100, 80, 60, 40, 85, 95, 70, 50, 60, 80, 90, 65, 35, 45, 75, 90, 85, 55, 40, 60, 70, 40, 20],
    voiceComments: [
      {
        id: "vc_1",
        user: {
          name: "Marcus Vance",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
        },
        duration: 9,
        transcript: "This is breathtaking Sophia! That voice intro gave me literal goosebumps.",
        timeAgo: "1 hour ago",
        likes: 42
      },
      {
        id: "vc_2",
        user: {
          name: "Elena Rostova",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
        },
        duration: 12,
        transcript: "Adding this to my travel bucket list immediately. Keep dropping these amazing voice stories!",
        timeAgo: "30 mins ago",
        likes: 19
      }
    ]
  },
  {
    id: "post_2",
    creator: {
      id: "creator_2",
      name: "Liam O'Connor",
      username: "liam_audio",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      verified: false
    },
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80",
    audioDuration: 24,
    voiceCaptionTitle: "Late night jazz bar session in Tokyo - Hear the sax solo",
    voiceTranscript: "Tucked away in a tiny basement in Shinjuku... The saxophonist started playing this improvisational blues melody while rain hit the sidewalk outside. I just had to capture the vibe.",
    optionalTextCaption: "Rainy nights & soulful sax in Tokyo 🎷 Raindrops on jazz glass.",
    likes: 2890,
    isLiked: false,
    bookmarks: 610,
    isBookmarked: false,
    postedTime: "5 hours ago",
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    waveform: [30, 50, 75, 95, 100, 85, 60, 40, 70, 90, 80, 65, 85, 95, 100, 85, 70, 50, 65, 85, 90, 75, 60, 80, 95, 70, 45, 30, 50, 40, 25],
    voiceComments: [
      {
        id: "vc_3",
        user: {
          name: "Chloe Bennett",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
        },
        duration: 7,
        transcript: "Oh man, that sax tone is butter. Tokyo jazz bars hit different!",
        timeAgo: "3 hours ago",
        likes: 88
      }
    ]
  },
  {
    id: "post_3",
    creator: {
      id: "creator_3",
      name: "Aria Thorne",
      username: "aria_stories",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      verified: true
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    audioDuration: 15,
    voiceCaptionTitle: "Waves washing over white sands in Amalfi Coast",
    voiceTranscript: "Closing my eyes and letting the sea sound clear my mind. Press play, close your eyes for 15 seconds, and pretend you're right here next to me on the shoreline.",
    optionalTextCaption: "Your 15-second ocean reset 🌊 Press play and breathe out.",
    likes: 3410,
    isLiked: false,
    bookmarks: 920,
    isBookmarked: false,
    postedTime: "8 hours ago",
    createdAt: Date.now() - 8 * 60 * 60 * 1000,
    waveform: [20, 35, 55, 75, 85, 60, 40, 65, 80, 95, 70, 50, 60, 75, 85, 90, 65, 45, 60, 75, 85, 60, 40, 55, 70, 50, 35, 25, 40, 30, 20],
    voiceComments: []
  }
];

export const sampleVoiceStories = [
  { id: "st_1", name: "Sophia", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80", hasUnheard: true },
  { id: "st_2", name: "Liam", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", hasUnheard: true },
  { id: "st_3", name: "Aria", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", hasUnheard: false },
  { id: "st_4", name: "Marcus", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", hasUnheard: true },
  { id: "st_5", name: "Elena", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", hasUnheard: false }
];
