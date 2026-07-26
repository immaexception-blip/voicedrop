import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MobileDeviceFrame from './components/MobileDeviceFrame';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import PostCard from './components/PostCard';
import ProfileView from './components/ProfileView';
import SearchView from './components/SearchView';
import NotificationsView from './components/NotificationsView';
import VoiceRecorderModal from './components/VoiceRecorderModal';
import VoiceCommentModal from './components/VoiceCommentModal';
import CreatorProfileModal from './components/CreatorProfileModal';
import AuthModal from './components/AuthModal';
import WelcomeScreen from './components/WelcomeScreen';

function MainAppContent() {
  const { currentTab, posts, toastMessage, isLoggedIn } = useApp();
  const [isGuestExploring, setIsGuestExploring] = useState(false);

  return (
    <div className="app-screen">
      <Navbar />

      <main className="main-content">
        {currentTab === 'feed' && (
          <div>
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <h3>No VoiceDrops in feed</h3>
                <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Tap the center + button to record a new VoiceDrop!</p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'search' && <SearchView />}

        {currentTab === 'notifications' && <NotificationsView />}

        {currentTab === 'profile' && <ProfileView />}
      </main>

      <BottomNav />

      {/* Logged Out Welcome Marketing Screen */}
      {!isLoggedIn && !isGuestExploring && (
        <WelcomeScreen onExploreGuest={() => setIsGuestExploring(true)} />
      )}

      {/* Studio Modals, Auth & Other Creator Profiles */}
      <VoiceRecorderModal />
      <VoiceCommentModal />
      <CreatorProfileModal />
      <AuthModal />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          bottom: '86px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-aqua)',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: '700',
          boxShadow: 'var(--shadow-glow)',
          zIndex: 1000,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.2s ease'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MobileDeviceFrame>
        <MainAppContent />
      </MobileDeviceFrame>
    </AppProvider>
  );
}
