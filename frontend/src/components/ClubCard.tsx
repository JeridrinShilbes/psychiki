import { Users, Clock, ChevronRight } from 'lucide-react';
import type { Club } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface ClubCardProps {
    club: Club;
    onJoin: () => void;
}

export function ClubCard({ club, onJoin }: ClubCardProps) {
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
