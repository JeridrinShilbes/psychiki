import { Users, Clock, ChevronRight, MapPin } from 'lucide-react';
import type { Club } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';

interface ClubCardProps {
    club: Club;
    onJoin: () => void;
    hasJoined?: boolean;
}

export function ClubCard({ club, onJoin, hasJoined }: ClubCardProps) {
    return (
        <CardContainer containerClassName="w-full h-full py-0" className="w-full h-full">
            <CardBody
                className="bg-white rounded-3xl p-3 border border-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] group/card dark:hover:shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-300 transition-all flex flex-col w-full h-full cursor-pointer relative"
                onClick={onJoin}
            >
                <CardItem translateZ="40" className="relative h-56 w-full rounded-2xl overflow-hidden bg-gray-50 mb-4 shrink-0">
                    <img
                        src={club.image}
                        alt={club.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <CategoryBadge category={club.category} />
                    </div>

                    {/* Joined Badge */}
                    {hasJoined && (
                        <div className="absolute top-3 right-3 bg-[#18452B] backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Joined
                        </div>
                    )}
                </CardItem>

                <div className="px-1 pb-1 flex flex-col flex-grow">
                    <CardItem translateZ="30" className="flex justify-between items-start mb-2 w-full">
                        <h3 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight line-clamp-2">{club.title}</h3>
                    </CardItem>

                    <CardItem translateZ="20" className="w-full">
                        <p className="text-gray-500 text-[13px] line-clamp-2 mb-4 leading-relaxed font-medium">
                            {club.description}
                        </p>
                    </CardItem>

                    {/* Author attribution */}
                    <CardItem translateZ="15" className="w-full">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-3 font-bold">
                            Organized by <span className="text-gray-700">{club.author}</span>
                        </p>
                    </CardItem>

                    <CardItem translateZ="15" className="w-full flex flex-wrap gap-1.5 mb-4">
                        {club.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg font-bold tracking-wide uppercase">
                                {tag}
                            </span>
                        ))}
                    </CardItem>

                    {club.joinedUsers && club.joinedUsers.length > 0 && (
                        <CardItem translateZ="10" className="mb-4 bg-gray-50/80 p-2.5 rounded-2xl w-full border border-gray-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Joined by</p>
                            <div className="flex flex-wrap gap-1.5">
                                {club.joinedUsers.map((name, i) => (
                                    <span key={i} className="text-[11px] bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200/60 font-medium shadow-sm">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </CardItem>
                    )}

                    <CardItem translateZ="20" className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 font-medium border-t border-gray-100/80 w-full">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 font-semibold">
                                <Users size={14} className="text-emerald-600" /> {club.members}
                            </span>
                            <span className="flex items-center gap-1.5 line-clamp-1 max-w-[80px] font-semibold">
                                <Clock size={14} className="text-emerald-600" /> {club.schedule}
                            </span>
                            {club.distance !== undefined && (
                                <span className="flex items-center gap-1.5 text-gray-900 font-bold">
                                    <MapPin size={14} className="text-gray-400" /> {club.distance.toFixed(1)} km
                                </span>
                            )}
                        </div>
                        <div className="bg-black text-white p-1.5 rounded-full group-hover/card:bg-emerald-600 transition-colors">
                            <ChevronRight size={14} strokeWidth={3} className="flex-shrink-0 group-hover/card:-translate-x-0.5 transition-transform duration-300" />
                        </div>
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
}