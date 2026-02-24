import { LayoutGrid, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-gray-200/60 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section: Logo */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setCurrentView('feed')}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            className="h-8 w-auto text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path d="M20 40 L50 20 L80 40" />
                            <path d="M20 45 H80" />
                            <path d="M30 45 V75" />
                            <path d="M50 45 V75" />
                            <path d="M70 45 V75" />
                            <path d="M20 80 H80" />
                        </svg>
                        <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Psychiki</span>
                    </motion.div>

                    {/* Middle Section: Nav Items */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {navItems.map((item) => {
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`relative px-4 py-2 flex items-center gap-2 text-sm font-semibold tracking-tight transition-colors rounded-xl ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/80 backdrop-blur shadow-sm border border-gray-200/60 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <item.icon size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Section: User Info & Logout */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <span className="text-sm font-semibold tracking-tight text-gray-700 hidden md:block">{userName}</span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-xl hover:bg-gray-100/80"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:block font-medium">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
