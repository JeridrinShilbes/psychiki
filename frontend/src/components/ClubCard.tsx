import { Users, Clock, ChevronRight, Trash2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Club } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface ClubCardProps {
    club: Club;
    onJoin: () => void;
    // Added props for deletion logic
    currentUser?: string;
    onDelete?: (id: string, author: string) => void;
    hasJoined?: boolean;
}

export function ClubCard({ club, onJoin, currentUser, onDelete, hasJoined }: ClubCardProps) {
    const isAuthor = currentUser === club.author;

    const handleDeleteClick = (e: React.MouseEvent) => {
        // Prevents the onJoin (card click) from firing when clicking delete
        e.stopPropagation();
        if (onDelete) {
            onDelete(club.id, club.author);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[24px] p-2 border border-gray-200/80 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-300 transition-all flex flex-col group cursor-pointer"
            onClick={onJoin}
        >
            <div className="relative h-48 w-full rounded-[16px] overflow-hidden bg-gray-50 mb-3">
                <img
                    src={club.image}
                    alt={club.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <CategoryBadge category={club.category} />
                </div>

                {/* Conditional Delete Button - Only shows if user is the author */}
                {isAuthor && onDelete && (
                    <button
                        onClick={handleDeleteClick}
                        className="absolute top-3 right-3 z-10 p-2 bg-red-50/90 backdrop-blur-md text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete Event"
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                {/* Match Score Badge - Only shows if not the author (to save space) */}
                {!isAuthor && club.matchScore > 80 && !hasJoined && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Match
                    </div>
                )}

                {/* Joined Badge */}
                {hasJoined && (
                    <div className="absolute top-3 right-3 bg-[#18452B] backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Joined
                    </div>
                )}
            </div>

            <div className="px-3 pb-3 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{club.title}</h3>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
                    {club.description}
                </p>

                {/* Author attribution */}
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-3 font-bold">
                    Organized by <span className="text-gray-700">{isAuthor ? 'You' : club.author}</span>
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {club.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[11px] text-gray-700 bg-gray-100/80 border border-gray-200/60 px-2.5 py-1 rounded-lg font-semibold tracking-wide">
                            {tag}
                        </span>
                    ))}
                    {club.tags.length > 3 && (
                        <span className="text-[11px] text-gray-400 font-medium px-1 py-1">
                            +{club.tags.length - 3}
                        </span>
                    )}
                </div>

                {club.joinedUsers && club.joinedUsers.length > 0 && (
                    <div className="mb-4 bg-gray-50/50 p-2 rounded-xl border border-gray-100/80">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Joined by</p>
                        <div className="flex flex-wrap gap-1.5">
                            {club.joinedUsers.map((name, i) => (
                                <span key={i} className="text-[11px] bg-white text-gray-600 px-2 py-0.5 rounded-md border border-gray-200/60 font-medium shadow-sm">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 font-medium border-t border-gray-100/80">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-semibold">
                            <Users size={14} className="text-gray-400" /> {club.members}
                        </span>
                        <span className="flex items-center gap-1.5 line-clamp-1 max-w-[80px] font-semibold">
                            <Clock size={14} className="text-gray-400" /> {club.schedule}
                        </span>
                        {club.distance !== undefined && (
                            <span className="flex items-center gap-1.5 text-gray-900 font-bold">
                                <MapPin size={14} className="text-gray-400" /> {club.distance.toFixed(1)} km
                            </span>
                        )}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all duration-300" />
                </div>
            </div>
        </motion.div>
    );
}