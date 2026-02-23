import { Users, Clock, ChevronRight, Trash2, MapPin } from 'lucide-react';
import type { Club } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface ClubCardProps {
    club: Club;
    onJoin: () => void;
    // Added props for deletion logic
    currentUser?: string;
    onDelete?: (id: string, author: string) => void;
}

export function ClubCard({ club, onJoin, currentUser, onDelete }: ClubCardProps) {

    const isAuthor = currentUser === club.author;

    const handleDeleteClick = (e: React.MouseEvent) => {
        // Prevents the onJoin (card click) from firing when clicking delete
        e.stopPropagation();
        if (onDelete) {
            onDelete(club.id, club.author);
        }
    };

    return (
        <div
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            onClick={onJoin}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={club.image}
                    alt={club.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <CategoryBadge category={club.category} />
                </div>

                {/* Conditional Delete Button - Only shows if user is the author */}
                {isAuthor && onDelete && (
                    <button
                        onClick={handleDeleteClick}
                        className="absolute top-4 right-4 z-10 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-md"
                        title="Delete Event"
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                {/* Match Score Badge - Only shows if not the author (to save space) */}
                {!isAuthor && club.matchScore > 80 && (
                    <div className="absolute top-4 right-4 bg-[#E2F019] text-[#18452B] text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                        Match
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{club.title}</h3>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {club.description}
                </p>

                {/* Author attribution */}
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4 font-bold">
                    Organized by {isAuthor ? 'You' : club.author}
                </p>

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
                        <span className="flex items-center gap-1.5">
                            <Users size={14} /> {club.members}
                        </span>
                        <span className="flex items-center gap-1.5 line-clamp-1 max-w-[80px]">
                            <Clock size={14} /> {club.schedule}
                        </span>
                        {club.distance !== undefined && (
                            <span className="flex items-center gap-1.5 text-[#18452B]">
                                <MapPin size={14} /> {club.distance.toFixed(1)} km
                            </span>
                        )}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 group-hover:text-[#18452B] transition-colors" />
                </div>
            </div>
        </div>
    );
}