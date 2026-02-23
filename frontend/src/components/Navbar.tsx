import { Activity, LayoutGrid, Sparkles, User as UserIcon, LogOut, ClipboardList } from 'lucide-react';

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
        { id: 'noticeboard', label: 'Noticeboard', icon: ClipboardList },
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
                        <span className="font-bold text-xl tracking-tight text-gray-900">Psychiki</span>
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
