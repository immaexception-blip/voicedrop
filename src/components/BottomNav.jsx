import React from 'react';
import { Home, Compass, Plus, User, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { currentTab, setCurrentTab, setIsRecorderOpen, user } = useApp();

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${currentTab === 'feed' ? 'active' : ''}`}
        onClick={() => setCurrentTab('feed')}
      >
        <Home size={22} />
        <span>Feed</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'explore' ? 'active' : ''}`}
        onClick={() => setCurrentTab('explore')}
      >
        <Compass size={22} />
        <span>Explore</span>
      </button>

      {/* Floating Glowing Center Voice Drop Button */}
      <button 
        className="nav-create-btn"
        onClick={() => setIsRecorderOpen(true)}
        title="Record VoiceDrop"
      >
        <Plus size={28} strokeWidth={2.8} />
      </button>

      <button 
        className={`nav-item ${currentTab === 'notifications' ? 'active' : ''}`}
        onClick={() => setCurrentTab('notifications')}
      >
        <Heart size={22} />
        <span>Activity</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentTab('profile')}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: currentTab === 'profile' ? '2px solid var(--accent-pink)' : '1px solid var(--text-muted)'
        }}>
          <img src={user.avatar} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span>Profile</span>
      </button>
    </nav>
  );
}
