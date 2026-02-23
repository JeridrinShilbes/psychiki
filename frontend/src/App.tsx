import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Sparkles,
  User as UserIcon,
  LogOut,
  Search,
  Users,
  Clock,
  Flame,
  Wind,
  HeartHandshake,
  CheckCircle2,
  X,
  ChevronRight,
  Activity,
  ArrowRight
} from 'lucide-react';

// --- Types & Interfaces ---
interface UserProfile {
  name: string;
  email: string;
  primaryFocus: string | null;
  interests: string[];
}

interface Club {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  members: number;
  schedule: string;
  matchScore: number;
}

// --- Configuration & Constants ---
const apiKey = ""; // Gemini API Key will be injected by the environment

const MOCK_USER: UserProfile = {
  name: 'eta',
  email: 'raohemonish@gmail.com',
  primaryFocus: null, // Starts null to demonstrate onboarding
  interests: ['#GymAnxiety', '#PostWorkDecompression', '#RunnerLife']
};

const ALL_TAGS: string[] = [
  '#GymAnxiety', '#Endurance', '#NeedToVent', '#MeditationNewbie',
  '#PostWorkDecompression', '#MorningPerson', '#NightOwl', '#HIIT', '#Yoga',
  '#RunnerLife', '#Weightlifting', '#MentalHealth', '#Socializing', '#QuietTime',
  '#NatureLover', '#CoffeeAfter', '#Stretching', '#Breathwork', '#GroupEnergy',
  '#SoloButTogether', '#StressRelief', '#BodyPositive', '#BeginnerFriendly',
  '#PushLimits'
];

const INITIAL_CLUBS: Club[] = [
  {
    id: 1,
    title: 'Zen Lifters',
    description: 'Weightlifting followed by a 15-minute guided mindfulness cooldown. Build strength for your body, peace for your mind.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    category: 'Burn Energy',
    tags: ['#Weightlifting', '#MeditationNewbie', '#StressRelief'],
    members: 23,
    schedule: 'Tuesdays & Thursdays, 6:30 PM',
    matchScore: 95
  },
  {
    id: 2,
    title: 'Anxiety Burn',
    description: 'High-intensity interval training designed to burn off nervous energy, followed by a 20-minute cool-down chat.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfe09ce14?auto=format&fit=crop&q=80&w=600',
    category: 'Burn Energy',
    tags: ['#HIIT', '#GymAnxiety', '#StressRelief'],
    members: 18,
    schedule: 'Mondays & Wednesdays, 7:00 PM',
    matchScore: 90
  },
  {
    id: 3,
    title: 'Coffee & Miles',
    description: 'A running group that always ends at a local coffee shop. The run is the warm-up; the real magic is the conversation after.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600',
    category: 'Burn Energy',
    tags: ['#RunnerLife', '#CoffeeAfter', '#Socializing'],
    members: 35,
    schedule: 'Wednesdays & Saturdays, 7:00 AM',
    matchScore: 88
  },
  {
    id: 4,
    title: 'Pace & Ponder',
    description: 'Brisk walking while discussing audiobooks or podcasts. A great way to get moving without the pressure of a run.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
    category: 'Find People',
    tags: ['#Endurance', '#QuietTime', '#Socializing'],
    members: 12,
    schedule: 'Sundays, 8:00 AM',
    matchScore: 75
  },
  {
    id: 5,
    title: 'Sunrise Stretch Circle',
    description: 'Gentle morning yoga and stretching to wake up the body. Perfect for decompression before a long workday.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    category: 'Clear Head',
    tags: ['#Yoga', '#MorningPerson', '#Stretching'],
    members: 28,
    schedule: 'Weekdays, 6:30 AM',
    matchScore: 82
  },
  {
    id: 6,
    title: 'Trail Talk',
    description: 'Weekend nature hikes focused on opening up. Leave the city behind and talk about what\'s really on your mind.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=600',
    category: 'Find People',
    tags: ['#NatureLover', '#NeedToVent', '#GroupEnergy'],
    members: 15,
    schedule: 'Saturdays, 9:00 AM',
    matchScore: 85
  }
];

// --- Utility Components ---
const CategoryBadge = ({ category }: { category: string | null }) => {
  const styles: Record<string, string> = {
    'Burn Energy': 'bg-orange-100 text-orange-700 border-orange-200',
    'Clear Head': 'bg-teal-100 text-teal-700 border-teal-200',
    'Find People': 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const appliedStyle = category && styles[category] ? styles[category] : 'bg-gray-100 text-gray-700';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${appliedStyle}`}>
      {category}
    </span>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('feed'); // feed, matchmaker, profile
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [activeFilter, setActiveFilter] = useState<string>('All Clubs');
  const [rsvpModal, setRsvpModal] = useState<{ isOpen: boolean; club: Club | null }>({ isOpen: false, club: null });

  const handleLogout = () => {
    setUser(null);
    setCurrentView('feed');
  };

  // Auth Screen Flow
  if (!user) {
    return <AuthScreen onLogin={(userData) => setUser(userData)} />;
  }

  // Onboarding Flow
  if (!user.primaryFocus) {
    return (
      <Onboarding
        onComplete={(focus) => setUser({ ...user, primaryFocus: focus })}
        onSignOut={handleLogout}
      />
    );
  }

  // Main App Flow
  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <Feed
          user={user}
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
        return <Profile user={user} setUser={setUser} />;
      default:
        return <Feed user={user} clubs={clubs} activeFilter={activeFilter} setActiveFilter={setActiveFilter} onJoin={(club) => setRsvpModal({ isOpen: true, club })} />;
    }
  };

  return (
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
  );
}

// --- Auth Screen (Login & Signup) ---
interface AuthScreenProps {
  onLogin: (userData: UserProfile) => void;
}

function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/signup logic -> proceeds to Onboarding
    onLogin({
      name: isLoginMode ? 'eta' : (name || 'New User'),
      email: email || 'user@example.com',
      primaryFocus: null, // Always force onboarding for the demo
      interests: []
    });
  };

  return (
    <div className="min-h-screen flex font-sans bg-white selection:bg-[#C4F22B]/30">
      {/* Left Banner Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F2D1B] text-white p-12 flex-col relative overflow-hidden">

        {/* Decorative Circles */}
        <div className="absolute top-1/4 right-10 w-[32rem] h-[32rem] bg-[#143B23] rounded-full"></div>
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-[#143B23] rounded-full"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-32">
            <div className="bg-white/10 p-1.5 rounded-md backdrop-blur-sm border border-white/5">
              <Activity size={20} strokeWidth={3} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">MicroClub</span>
          </div>

          {/* Hero Copy */}
          <div className="max-w-lg">
            <h1 className="text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Find your <br />people. <br />
              <span className="text-[#C4F22B]">Move together.</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium pr-12">
              Join hyper-specific wellness micro-clubs that combine physical activity with real human connection.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAFAFA] lg:bg-white relative">
        {/* Mobile Logo Fallback */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
          <div className="bg-[#18452B] text-white p-1.5 rounded-md">
            <Activity size={20} strokeWidth={3} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">MicroClub</span>
        </div>

        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center sm:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {isLoginMode ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-500 font-medium">
              {isLoginMode ? 'Log in to find your next session' : 'Your wellness community awaits'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginMode && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-white"
                  required={!isLoginMode}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-4 bg-[#18452B] hover:bg-[#113320] text-white font-bold rounded-xl transition-all shadow-md shadow-green-900/10 flex items-center justify-center gap-2 group"
            >
              {isLoginMode ? 'Log in' : 'Create account'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <span className="text-[#18452B] font-bold">
                {isLoginMode ? "Sign up" : "Log in"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Navigation ---
interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userName: string;
  onLogout: () => void;
}

function Navbar({ currentView, setCurrentView, userName, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: LayoutGrid },
    { id: 'matchmaker', label: 'Matchmaker', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('feed')}>
            <div className="bg-[#18452B] text-white p-1.5 rounded-md">
              <Activity size={20} strokeWidth={3} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">MicroClub</span>
          </div>

          <div className="hidden sm:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentView === item.id
                    ? 'text-[#18452B]'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                <item.icon size={18} className={currentView === item.id ? 'text-[#18452B]' : 'text-gray-400'} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">{userName}</span>
            <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- Gamified Onboarding ---
interface OnboardingProps {
  onComplete: (focus: string) => void;
  onSignOut: () => void;
}

function Onboarding({ onComplete, onSignOut }: OnboardingProps) {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  const options = [
    {
      id: 'Burn Energy',
      title: 'Burn Energy',
      description: 'Physical exhaustion, endorphins, fitness goals.\n\nPairs you with running, HIIT, and high-intensity clubs where you push limits and feel alive.',
      icon: Flame,
      bgImage: 'https://images.unsplash.com/photo-1552674605-db6aea4df4c9?auto=format&fit=crop&q=80&w=600',
      overlay: 'from-[#D65D20] via-[#D65D20]/90 to-[#D65D20]/60',
      activeRing: 'ring-[#D65D20]'
    },
    {
      id: 'Clear Head',
      title: 'Clear My Head',
      description: 'Mental decompression, mindfulness, low-impact.\n\nConnects you with yoga, stretching, breathwork, and silent reading clubs for peace of mind.',
      icon: Wind,
      bgImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
      overlay: 'from-[#209A82] via-[#209A82]/90 to-[#209A82]/60',
      activeRing: 'ring-[#209A82]'
    },
    {
      id: 'Find People',
      title: 'Find My People',
      description: 'Deep socializing, venting, shared struggles.\n\nMatches you with walking-and-talking groups and post-workout coffee clubs built for real connection.',
      icon: HeartHandshake,
      bgImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
      overlay: 'from-[#364A9F] via-[#364A9F]/90 to-[#364A9F]/60',
      activeRing: 'ring-[#364A9F]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative font-sans">

      {/* Top Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-[#18452B] text-white p-1.5 rounded-md">
            <Activity size={20} strokeWidth={3} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">MicroClub</span>
        </div>
        <button onClick={onSignOut} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Sign out
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 mt-16 lg:mt-0">

        <div className="text-center space-y-4 mb-12">
          <p className="text-xs font-bold tracking-widest text-[#D65D20] uppercase">
            Step 1 of 1
          </p>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            What brings you here?
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Choose your primary focus. This helps us match you with the right micro-clubs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedFocus(opt.id)}
              className={`relative h-[26rem] rounded-[2.5rem] overflow-hidden text-left transition-all duration-300 group hover:-translate-y-2
                ${selectedFocus === opt.id ? `ring-4 ring-offset-4 ${opt.activeRing} scale-[1.02]` : 'hover:shadow-2xl opacity-90 hover:opacity-100'}
              `}
            >
              <img
                src={opt.bgImage}
                alt={opt.title}
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${opt.overlay} z-10`}></div>

              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white border border-white/20">
                  <opt.icon size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{opt.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {opt.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12">
          <button
            onClick={() => {
              if (selectedFocus) onComplete(selectedFocus);
            }}
            disabled={!selectedFocus}
            className="px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-300
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              bg-[#18452B] text-white hover:bg-[#113320] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Continue <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Feed View ---
interface FeedProps {
  user: UserProfile;
  clubs: Club[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onJoin: (club: Club) => void;
}

function Feed({ user, clubs, activeFilter, setActiveFilter, onJoin }: FeedProps) {
  const filters = ['All Clubs', 'Burn Energy', 'Clear Head', 'Find People'];

  const filteredClubs = activeFilter === 'All Clubs'
    ? clubs
    : clubs.filter(c => c.category === activeFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hey, {user.name}</h1>
        <p className="text-gray-500 text-lg">Here are clubs matched to your vibe. The more tags you add, the smarter it gets.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clubs, tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-white shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeFilter === filter
                  ? 'bg-[#18452B] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => (
          <ClubCard key={club.id} club={club} onJoin={() => onJoin(club)} />
        ))}
      </div>
    </div>
  );
}

interface ClubCardProps {
  club: Club;
  onJoin: () => void;
}

function ClubCard({ club, onJoin }: ClubCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer" onClick={onJoin}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={club.image}
          alt={club.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge category={club.category} />
        </div>
        {club.matchScore > 80 && (
          <div className="absolute top-4 right-4 bg-[#E2F019] text-[#18452B] text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
            Match
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{club.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{club.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {club.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
              {tag}
            </span>
          ))}
          {club.tags.length > 3 && (
            <span className="text-xs text-gray-400 font-medium px-1 py-1">
              +{club.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Users size={14} /> {club.members}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {club.schedule}</span>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-[#18452B] transition-colors" />
        </div>
      </div>
    </div>
  );
}

// --- Pre-RSVP Intent Modal ---
interface RsvpModalProps {
  club: Club;
  onClose: () => void;
}

function RsvpModal({ club, onClose }: RsvpModalProps) {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const intents = [
    { id: 'sweat', label: 'Break a sweat', desc: 'Focus on the physical activity' },
    { id: 'vent', label: 'Get something off my chest', desc: 'Need to talk and be heard' },
    { id: 'listen', label: 'Just listen and be around others', desc: 'Low social pressure today' }
  ];

  const handleConfirm = () => {
    if (!selectedIntent) return;
    setIsConfirmed(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {!isConfirmed ? (
          <>
            <div className="relative h-32">
              <img src={club.image} alt={club.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 rounded-full p-1 backdrop-blur-md">
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-xl font-bold">{club.title}</h2>
                <p className="text-white/80 text-sm">RSVP Setup</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">What's your main goal for today's session?</h3>
                <p className="text-sm text-gray-500">This helps the host tune the vibe of the meetup.</p>
              </div>

              <div className="space-y-3">
                {intents.map(intent => (
                  <button
                    key={intent.id}
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`w-full flex items-center p-4 rounded-2xl border-2 text-left transition-all ${selectedIntent === intent.id
                        ? 'border-[#18452B] bg-[#18452B]/5'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${selectedIntent === intent.id ? 'border-[#18452B]' : 'border-gray-300'
                      }`}>
                      {selectedIntent === intent.id && <div className="w-2.5 h-2.5 bg-[#18452B] rounded-full" />}
                    </div>
                    <div>
                      <div className={`font-semibold ${selectedIntent === intent.id ? 'text-[#18452B]' : 'text-gray-900'}`}>
                        {intent.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{intent.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedIntent}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#18452B] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#113320] transition-colors shadow-lg shadow-green-900/20"
              >
                Confirm RSVP
              </button>
            </div>
          </>
        ) : (
          <div className="p-10 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">You're In!</h3>
            <p className="text-gray-500">The host has been subtly notified of your vibe for today. See you there!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- AI Community Matchmaker ---
interface MatchmakerProps {
  onNewClubsFound: (clubs: Club[]) => void;
}

function Matchmaker({ onNewClubsFound }: MatchmakerProps) {
  const [feeling, setFeeling] = useState<string>('');
  const [goals, setGoals] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateClubs = async () => {
    if (!feeling || !goals) {
      setError('Please fill in both fields so we can find the best match.');
      return;
    }
    setError('');
    setIsGenerating(true);

    const systemPrompt = `You are the Community Matchmaker for a holistic health platform. Your goal is to analyze a user's current physical and mental wellness goals and suggest 3 highly specific 'Micro-Clubs' they should join.

A 'Micro-Club' must combine a physical activity with a mental/social component. Do not suggest generic groups like 'Running Club' or 'Meditation Group.' Instead, suggest hyper-specific, welcoming concepts (e.g., 'Zen Lifters' for weightlifting followed by mindfulness, 'Pace & Ponder' for brisk walking while discussing audiobooks).

Tone: Empathetic, highly encouraging, non-judgmental, and community-focused. You are not a doctor; do not give medical or psychiatric advice. Focus entirely on community, routine building, and shared experiences.

Based on the user's feelings and goals, generate exactly 3 clubs.`;

    const userPrompt = `User Feeling: ${feeling}\nUser Goals: ${goals}\nRecommend their clubs now.`;

    try {
      const fetchWithRetry = async (url: string, options: RequestInit, retries = 5): Promise<any> => {
        let delay = 1000;
        for (let i = 0; i < retries; i++) {
          try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
          } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
          }
        }
      };

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              clubs: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    tags: { type: "ARRAY", items: { type: "STRING" } },
                    category: { type: "STRING", description: "Must be exactly one of: 'Burn Energy', 'Clear Head', or 'Find People'" },
                    schedule: { type: "STRING" }
                  },
                  required: ["title", "description", "tags", "category", "schedule"]
                }
              }
            },
            required: ["clubs"]
          }
        }
      };

      const result = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No valid response from AI");

      const parsed = JSON.parse(text);

      const newClubs: Club[] = parsed.clubs.map((c: any, i: number) => {
        const images: Record<string, string[]> = {
          'Burn Energy': ['https://images.unsplash.com/photo-1517836357463-d25dfe09ce14?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600'],
          'Clear Head': ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'],
          'Find People': ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600']
        };
        const catImages = images[c.category] || images['Clear Head'];
        const randomImage = catImages[Math.floor(Math.random() * catImages.length)];

        return {
          id: Date.now() + i,
          title: c.title,
          description: c.description,
          category: ['Burn Energy', 'Clear Head', 'Find People'].includes(c.category) ? c.category : 'Clear Head',
          tags: c.tags.slice(0, 4),
          schedule: c.schedule || 'Schedule TBD',
          members: Math.floor(Math.random() * 20) + 5,
          image: randomImage,
          matchScore: 99
        };
      });

      onNewClubsFound(newClubs);

    } catch (err) {
      console.error(err);
      setError("We couldn't generate matches right now. Please try again or check your API key setup.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-green-100 text-[#18452B] rounded-full text-xs font-bold mb-2">
          <Sparkles size={12} className="mr-1 inline" /> AI-Powered
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Matchmaker</h1>
        <p className="text-gray-500">
          Tell us how you're feeling and what you need. We'll suggest hyper-specific micro-clubs just for you.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">How are you feeling right now?</label>
          <textarea
            rows={3}
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-gray-50/50 resize-none"
            placeholder="e.g., Stressed from work, need to decompress... or full of energy and want to sweat."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">What are your goals this week?</label>
          <textarea
            rows={3}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-gray-50/50 resize-none"
            placeholder="e.g., Build a consistent workout routine, meet new people, get out of my head."
          />
        </div>

        <button
          onClick={generateClubs}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl font-bold text-white bg-[#18452B] hover:bg-[#113320] transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Finding your tribe...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Find My Clubs
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// --- User Profile ---
interface ProfileProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

function Profile({ user, setUser }: ProfileProps) {
  const [localInterests, setLocalInterests] = useState<string[]>(user.interests);

  const toggleTag = (tag: string) => {
    if (localInterests.includes(tag)) {
      setLocalInterests(localInterests.filter(t => t !== tag));
    } else {
      setLocalInterests([...localInterests, tag]);
    }
  };

  const handleSave = () => {
    setUser({ ...user, interests: localInterests });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
        <p className="text-gray-500">Fine-tune your micro-interests to get better club matches.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-[#18452B] text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm mb-3">{user.email}</p>
          <CategoryBadge category={user.primaryFocus} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Micro-Interests</h3>
            <p className="text-gray-500 text-sm mt-1">Select tags that resonate with you. These shape your club recommendations.</p>
          </div>
          <div className="text-sm font-medium text-gray-400">
            {localInterests.length} selected
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          {ALL_TAGS.map(tag => {
            const isSelected = localInterests.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected
                    ? 'bg-[#18452B] text-white border-[#18452B] shadow-md shadow-green-900/10 scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl font-bold text-white bg-[#18452B] hover:bg-[#113320] transition-colors shadow-lg shadow-green-900/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}