import { Search } from 'lucide-react';
import type { UserProfile, Club } from '../types';
import { ClubCard } from './ClubCard';

interface FeedProps {
    user: UserProfile;
    clubs: Club[];
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    onJoin: (club: Club) => void;
}

export function Feed({ user, clubs, activeFilter, setActiveFilter, onJoin }: FeedProps) {
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
