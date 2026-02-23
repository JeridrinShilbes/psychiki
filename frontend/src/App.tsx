import { useState } from 'react';
import type { UserProfile, Club } from './types';
import { INITIAL_CLUBS } from './constants';
import { Navbar } from './components/Navbar';
import { Onboarding } from './components/Onboarding';
import { Feed } from './components/Feed';
import { Matchmaker } from './components/Matchmaker';
import { Profile } from './components/Profile';
import { RsvpModal } from './components/RsvpModal';

// --- Main App Component ---
export default function App() {
  // Directly bypass the AuthScreen by initialising with a mock user.
  // In a real application, you'd check authentication status here.
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Jeridrin',
    email: 'user@example.com',
    primaryFocus: null, // Always starts null to demonstrate onboarding
    interests: []
  });

  const [currentView, setCurrentView] = useState<string>('feed'); // feed, matchmaker, profile
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [activeFilter, setActiveFilter] = useState<string>('All Clubs');
  const [rsvpModal, setRsvpModal] = useState<{ isOpen: boolean; club: Club | null }>({ isOpen: false, club: null });

  const handleLogout = () => {
    // In this mocked environment without a login screen, we simply re-initialize the user 
    // instead of fully setting to null, to stay on the Onboarding screen.
    setUser({
      name: 'Jeridrin',
      email: 'user@example.com',
      primaryFocus: null,
      interests: []
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
          user={user as UserProfile}
          clubs={clubs}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onJoin={(club) => setRsvpModal({ isOpen: true, club })}
        />;
      case 'matchmaker':
        return <Matchmaker onNewClubsFound={(newClubs) => {
          setClubs([...newClubs, ...clubs]);
          setCurrentView('feed');
        }} />;
      case 'profile':
        return <Profile user={user as UserProfile} setUser={setUser} />;
      default:
        return <Feed user={user as UserProfile} clubs={clubs} activeFilter={activeFilter} setActiveFilter={setActiveFilter} onJoin={(club) => setRsvpModal({ isOpen: true, club })} />;
    }
  };

  return (
    <>
      {/* GLOBAL OVERRIDE: This style block prevents Vite's default CSS from squishing the app */}
      <style>{`
        #root {
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          text-align: left !important;
        }
        body {
          margin: 0 !important;
          display: block !important;
          background-color: #FAFAFA !important;
        }
      `}</style>

      {/* App Routing Flow */}
      {!user ? (
        <AuthScreen onLogin={(userData) => setUser(userData)} />
      ) : !user.primaryFocus ? (
        <Onboarding
          onComplete={(focus) => setUser({ ...user, primaryFocus: focus })}
          onSignOut={handleLogout}
        />
      ) : (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-green-200">
          <Navbar currentView={currentView} setCurrentView={setCurrentView} userName={user.name} onLogout={handleLogout} />

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderView()}
          </main>

          {/* Pre-RSVP Intent Modal */}
          {rsvpModal.isOpen && rsvpModal.club && (
            <RsvpModal
              club={rsvpModal.club}
              onClose={() => setRsvpModal({ isOpen: false, club: null })}
            />
          )}
        </div>
      )}
    </>
  );
}