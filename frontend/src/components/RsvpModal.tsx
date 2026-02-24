import { useState } from 'react';
import { X, Users, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Club } from '../types';

interface EventModalProps {
    club: Club;
    onClose: () => void;
    hasJoined?: boolean;
    onJoinSuccess?: (clubId: string) => void;
}
import { EVENTS_API } from '../constants';

export function RsvpModal({ club, onClose, hasJoined, onJoinSuccess }: EventModalProps) {
    const [isJoining, setIsJoining] = useState(false);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            // Updated to be a generic POST endpoint /join
            await fetch(`${EVENTS_API}/${club.id}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ members: club.members + 1 })
            });
        } catch (error) {
            console.error("Failed to update on backend", error);
        } finally {
            // Optimistically update the UI regardless of backend success for the demo
            if (onJoinSuccess) {
                onJoinSuccess(club.id);
            }
            setIsJoining(false);
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
                <div className="relative h-48">
                    <img src={club.image} alt={club.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 rounded-full p-1 backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </motion.button>
                    <div className="absolute bottom-4 left-6 text-white pr-6">
                        <h2 className="text-2xl font-bold mb-1">{club.title}</h2>
                        <p className="text-white/90 text-sm font-medium">{club.category}</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                        <p className="text-gray-700 leading-relaxed">{club.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-[#18452B] mb-1">
                                <Clock size={16} />
                                <span className="font-bold text-sm">When</span>
                            </div>
                            <p className="text-gray-700 text-sm">{club.schedule}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-[#18452B] mb-1">
                                <Users size={16} />
                                <span className="font-bold text-sm">Who</span>
                            </div>
                            <p className="text-gray-700 text-sm">{club.author}</p>
                        </div>
                    </div>

                    {club.tags.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Tag size={14} />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Tags</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {club.tags.map(tag => (
                                    <span key={tag} className="text-xs text-[#18452B] bg-[#18452B]/10 px-3 py-1.5 rounded-lg font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleJoin}
                        disabled={isJoining || hasJoined}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-md transition-colors flex items-center justify-center
                            ${hasJoined
                                ? 'bg-gray-400 cursor-not-allowed opacity-80'
                                : 'bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 disabled:opacity-50'}`}
                    >
                        {isJoining ? 'Joining...' : hasJoined ? 'Already Joined' : 'Join Event'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
