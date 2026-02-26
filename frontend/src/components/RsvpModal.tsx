import { useState } from 'react';
import { Users, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Club } from '../types';
import { EVENTS_API } from '../constants';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';

interface EventModalProps {
    club: Club;
    onClose: () => void;
    hasJoined?: boolean;
    userName: string;
    onJoinSuccess?: (clubId: string) => void;
    onDelete?: (eventId: string, authorName: string) => void;
}

export function RsvpModal({ club, onClose, hasJoined, userName, onJoinSuccess, onDelete }: EventModalProps) {
    const [isJoining, setIsJoining] = useState(false);
    const isAuthor = userName === club.author;

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            const token = localStorage.getItem('psychiki_token');
            const response = await fetch(`${EVENTS_API}/${club.id}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ userName: userName })
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.message || "Failed to join event.");
                setIsJoining(false);
                return;
            }

            if (onJoinSuccess) {
                onJoinSuccess(club.id);
            }
        } catch (error) {
            console.error("Failed to update on backend", error);
            alert("Network error. Please try again later.");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <CardContainer className="inter-var">
                <CardBody
                    className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[35rem] h-auto rounded-3xl p-8 border"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <CardItem
                        translateZ="50"
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        {club.title}
                    </CardItem>

                    <CardItem
                        as="p"
                        translateZ="60"
                        className="text-gray-500 text-sm mt-2 dark:text-neutral-300 flex items-center gap-2"
                    >
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{club.category}</span>
                        <span>•</span>
                        <span>Organized by {club.author}</span>
                    </CardItem>

                    <CardItem translateZ="100" className="w-full mt-6">
                        <img
                            src={club.image}
                            height="1000"
                            width="1000"
                            className="h-60 w-full object-cover rounded-2xl group-hover/card:shadow-xl transition-shadow"
                            alt={club.title}
                        />
                    </CardItem>

                    <CardItem translateZ="40" className="w-full mt-6">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-4 line-clamp-3">
                            {club.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl">
                                <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="font-semibold">{club.schedule}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl">
                                <Users size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="font-semibold">{club.members} Joined</span>
                            </div>
                        </div>

                        {club.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {club.tags.map(tag => (
                                    <span key={tag} className="text-[11px] font-bold tracking-wide uppercase text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </CardItem>

                    <div className="flex justify-between items-center mt-8">
                        <div className="flex gap-2">
                            <CardItem
                                translateZ={20}
                                as="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </CardItem>

                            {isAuthor && onDelete && (
                                <CardItem
                                    translateZ={20}
                                    as="button"
                                    onClick={() => {
                                        onDelete(club.id, club.author);
                                        onClose();
                                    }}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1.5"
                                    title="Delete Event"
                                >
                                    <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
                                </CardItem>
                            )}
                        </div>

                        <CardItem
                            translateZ={20}
                            as="button"
                            onClick={handleJoin}
                            disabled={isJoining || hasJoined}
                            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                                ${hasJoined
                                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-80'
                                    : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'}`}
                        >
                            {isJoining ? 'Joining...' : hasJoined ? 'Already Joined' : 'Join Event'}
                        </CardItem>
                    </div>
                </CardBody>
            </CardContainer>
        </motion.div>
    );
}
