import { LayoutGrid, Sparkles, User as UserIcon, LogOut } from 'lucide-react'; // Removed Activity

interface NavbarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    userName: string;
    onLogout: () => void;
}

export function Navbar({ currentView, setCurrentView, userName, onLogout }: NavbarProps) {
    const navItems = [
        { id: 'feed', label: 'Feed', icon: LayoutGrid },
        { id: 'matchmaker', label: 'Matchmaker', icon: Sparkles },
        { id: 'profile', label: 'Profile', icon: UserIcon },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Section: Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('feed')}>
                        {/* This is the raw SVG code for a thin, minimalistic temple */}
                        <svg
                            viewBox="0 0 100 100"
                            className="h-15 w-auto text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path d="M20 40 L50 20 L80 40" /> {/* Roof */}
                            <path d="M20 45 H80" />          {/* Top Base */}
                            <path d="M30 45 V75" />          {/* Left Column */}
                            <path d="M50 45 V75" />          {/* Middle Column */}
                            <path d="M70 45 V75" />          {/* Right Column */}
                            <path d="M20 80 H80" />          {/* Bottom Base */}
                        </svg>
                        <span className="font-bold text-2xl tracking-tight text-gray-900">Psychiki</span>
                    </div>

                    {/* Middle Section: Nav Items */}
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

                    {/* Right Section: User Info & Logout */}
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
