import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { Club } from '../types';

interface RsvpModalProps {
    club: Club;
    onClose: () => void;
}

export function RsvpModal({ club, onClose }: RsvpModalProps) {
    const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

    const intents = [
        { id: 'sweat', label: 'Break a sweat', desc: 'Focus on the physical activity' },
        { id: 'vent', label: 'Get something off my chest', desc: 'Need to talk and be heard' },
        { id: 'listen', label: 'Just listen and be around others', desc: 'Low social pressure today' }
    ];

    const handleConfirm = () => {
        if (!selectedIntent) return;
        setIsConfirmed(true);
        setTimeout(() => onClose(), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {!isConfirmed ? (
                    <>
                        <div className="relative h-32">
                            <img src={club.image} alt={club.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 rounded-full p-1 backdrop-blur-md">
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-6 text-white">
                                <h2 className="text-xl font-bold">{club.title}</h2>
                                <p className="text-white/80 text-sm">RSVP Setup</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">What's your main goal for today's session?</h3>
                                <p className="text-sm text-gray-500">This helps the host tune the vibe of the meetup.</p>
                            </div>

                            <div className="space-y-3">
                                {intents.map(intent => (
                                    <button
                                        key={intent.id}
                                        onClick={() => setSelectedIntent(intent.id)}
                                        className={`w-full flex items-center p-4 rounded-2xl border-2 text-left transition-all ${selectedIntent === intent.id
                                            ? 'border-[#18452B] bg-[#18452B]/5'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${selectedIntent === intent.id ? 'border-[#18452B]' : 'border-gray-300'
                                            }`}>
                                            {selectedIntent === intent.id && <div className="w-2.5 h-2.5 bg-[#18452B] rounded-full" />}
                                        </div>
                                        <div>
                                            <div className={`font-semibold ${selectedIntent === intent.id ? 'text-[#18452B]' : 'text-gray-900'}`}>
                                                {intent.label}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">{intent.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedIntent}
                                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#18452B] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#113320] transition-colors shadow-lg shadow-green-900/20"
                            >
                                Confirm RSVP
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-10 text-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">You're In!</h3>
                        <p className="text-gray-500">The host has been subtly notified of your vibe for today. See you there!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
