import React from 'react';
import { Home, Search, Plus, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { currentTab, setCurrentTab, setIsRecorderOpen, user } = useApp();

  return (
    <nav className="bottom-nav">
      {/* Slot 1: Feed */}
      <button 
        className={`nav-item ${currentTab === 'feed' ? 'active' : ''}`}
        onClick={() => setCurrentTab('feed')}
      >
        <Home size={20} />
        <span>Feed</span>
      </button>

      {/* Slot 2: Search */}
      <button 
        className={`nav-item ${currentTab === 'search' ? 'active' : ''}`}
        onClick={() => setCurrentTab('search')}
      >
        <Search size={20} />
        <span>Search</span>
      </button>

      {/* Slot 3: Plus Action Button (EXACT CENTER) */}
      <button 
        className="nav-plus-btn"
        onClick={() => setIsRecorderOpen(true)}
        title="Record VoiceDrop"
      >
        <Plus size={24} strokeWidth={2.8} />
      </button>

      {/* Slot 4: Activity */}
      <button 
        className={`nav-item ${currentTab === 'notifications' ? 'active' : ''}`}
        onClick={() => setCurrentTab('notifications')}
      >
        <Heart size={20} />
        <span>Activity</span>
      </button>

      {/* Slot 5: Profile */}
      <button 
        className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentTab('profile')}
      >
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: currentTab === 'profile' ? '2px solid var(--accent-aqua)' : '1px solid var(--text-muted)'
        }}>
          <img src={user.avatar} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span>Profile</span>
      </button>
    </nav>
  );
}
