// Initial Mock Data for VoiceDrop Social Network

export const currentUser = {
  id: "user_me",
  name: "Alex Rivera",
  username: "alex_voice",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "🎙️ Documenting moments with real voice notes. Audio storyteller & photographer.",
  voiceBioDuration: 8,
  voiceBioTranscript: "Hey there! Welcome to my VoiceDrop. I share raw photo stories with my natural voice narrations.",
  followers: 3420,
  following: 418,
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
    optionalTextCaption: "Worth every single freezing step of the 5 AM hike! 🏔️✨ #MorningVibes #Yosemite #VoiceStory",
    likes: 1240,
    isLiked: false,
    bookmarks: 284,
    isBookmarked: false,
    postedTime: "2 hours ago",
    tags: ["#MorningVibes", "#Yosemite", "#VoiceStory"],
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
    optionalTextCaption: "Rainy nights & soulful sax in Tokyo 🎷 Raindrops on jazz glass. #JazzVibes #TokyoNightlife #Soundtrack",
    likes: 2890,
    isLiked: true,
    bookmarks: 610,
    isBookmarked: true,
    postedTime: "5 hours ago",
    tags: ["#JazzVibes", "#TokyoNightlife", "#MusicStory"],
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
    optionalTextCaption: "Your 15-second ocean reset 🌊 Press play and breathe out. #OceanSounds #Amalfi #VoiceMeditation",
    likes: 3410,
    isLiked: false,
    bookmarks: 920,
    isBookmarked: false,
    postedTime: "8 hours ago",
    tags: ["#OceanSounds", "#Amalfi", "#VoiceMeditation"],
    waveform: [20, 35, 55, 75, 85, 60, 40, 65, 80, 95, 70, 50, 60, 75, 85, 90, 65, 45, 60, 75, 85, 60, 40, 55, 70, 50, 35, 25, 40, 30, 20],
    voiceComments: []
  }
];

export const trendingHashtags = [
  { tag: "#Storytime", count: "48.2K voice drops", icon: "💬" },
  { tag: "#MorningVibes", count: "32.6K voice drops", icon: "☀️" },
  { tag: "#TravelDiaries", count: "29.1K voice drops", icon: "✈️" },
  { tag: "#MusicVibes", count: "21.4K voice drops", icon: "🎷" },
  { tag: "#TechTalk", count: "18.9K voice drops", icon: "🎙️" },
  { tag: "#AmbientSounds", count: "14.3K voice drops", icon: "🌊" }
];

export const sampleVoiceStories = [
  { id: "st_1", name: "Sophia", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80", hasUnheard: true },
  { id: "st_2", name: "Liam", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", hasUnheard: true },
  { id: "st_3", name: "Aria", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", hasUnheard: false },
  { id: "st_4", name: "Marcus", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", hasUnheard: true },
  { id: "st_5", name: "Elena", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", hasUnheard: false }
];
