import { useState, useEffect } from 'react';
import type { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { Onboarding } from './components/Onboarding';
import { Feed } from './components/Feed';
import { Matchmaker } from './components/Matchmaker';
import { Profile } from './components/Profile';
import { Noticeboard } from './components/Noticeboard';
import { AuthModal } from './components/AuthModal';
import { AUTH_API } from './constants';

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('psychiki_token');
    if (token) {
      fetch(`${AUTH_API}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setUser({
              ...data,
              name: data.username,
              joinedEvents: []
            });
          }
        })
        .catch(() => { })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const [currentView, setCurrentView] = useState<string>('feed'); // feed, matchmaker, profile
  const [activeFilter, setActiveFilter] = useState<string>('All Clubs');

  const handleLogout = () => {
    localStorage.removeItem('psychiki_token');
    setUser(null);
    setCurrentView('feed');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white"></div>
      </div>
    );
  }


  // Unauthenticated Fallback -> auth modal + landing
  if (!user) {
    return (
      <>
        <Onboarding onGetStarted={() => setShowAuthModal(true)} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(token, newUserData) => {
            localStorage.setItem('psychiki_token', token);
            setUser({
              ...newUserData,
              name: newUserData.username,
              joinedEvents: []
            });
            setShowAuthModal(false);
          }}
        />
      </>
    );
  }

  // Main App Flow
  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <Feed
          user={user}
          setUser={setUser}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />;
      case 'matchmaker':
        return <Matchmaker onMatchmakerComplete={() => {
          setCurrentView('feed');
        }} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} />;
      case 'noticeboard':
        return <Noticeboard userName={user.name} />;
      default:
        return <Feed user={user} setUser={setUser} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-green-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} userName={user.name} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>


    </div>
  );
}