import { useState, useEffect } from 'react';
import type { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { Onboarding } from './components/Onboarding';
import { Feed } from './components/Feed';
import { Matchmaker } from './components/Matchmaker';
import { Profile } from './components/Profile';
import { Noticeboard } from './components/Noticeboard';

// --- Main App Component ---
export default function App() {
  // Directly bypass the AuthScreen by initialising with a mock user.
  // In a real application, you'd check authentication status here.
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('psychiki_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
    return {
      name: 'Jeridrin',
      email: 'user@example.com',
      primaryFocus: null, // Always starts null to demonstrate onboarding
      interests: [],
      joinedEvents: []
    };
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('psychiki_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('psychiki_user');
    }
  }, [user]);

  const [currentView, setCurrentView] = useState<string>('feed'); // feed, matchmaker, profile
  const [activeFilter, setActiveFilter] = useState<string>('All Clubs');

  const handleLogout = () => {
    // In this mocked environment without a login screen, we simply re-initialize the user 
    // instead of fully setting to null, to stay on the Onboarding screen.
    setUser({
      name: 'Jeridrin',
      email: 'user@example.com',
      primaryFocus: null,
      interests: [],
      joinedEvents: []
    });
    setCurrentView('feed');
  };

  // Auth Screen Flow (Removed from this version)

  // Onboarding Flow
  if (user && !user.primaryFocus) {
    return (
      <Onboarding
        onComplete={(focus) => setUser({ ...user, primaryFocus: focus })}
        onSignOut={handleLogout}
      />
    );
  }

  // Fallback if user somehow becomes null (shouldnt happen with mock data)
  if (!user) {
    return <div>Please reload the application.</div>;
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