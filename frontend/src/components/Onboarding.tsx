import { useState } from 'react';
import { Flame, Wind, HeartHandshake, ArrowRight } from 'lucide-react';

interface OnboardingProps {
    onComplete: (focus: string) => void;
    onSignOut: () => void;
}

export function Onboarding({ onComplete, onSignOut }: OnboardingProps) {
    const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

    const options = [
        {
            id: 'Burn Energy',
            title: 'Burn Energy',
            description: 'Physical exhaustion, endorphins, fitness goals.\n\nPairs you with running, HIIT, and high-intensity clubs where you push limits and feel alive.',
            icon: Flame,
            bgImage: 'https://i.redd.it/098i3veoa4aa1.jpg',
            overlay: 'from-[#D65D20] via-[#D65D20]/50 to-[#D65D20]/25',
            activeRing: 'ring-[#D65D20]'
        },
        {
            id: 'Clear Head',
            title: 'Clear My Head',
            description: 'Mental decompression, mindfulness, low-impact.\n\nConnects you with yoga, stretching, breathwork, and silent reading clubs for peace of mind.',
            icon: Wind,
            bgImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
            overlay: 'from-[#209A82] via-[#209A82]/50 to-[#209A82]/25',
            activeRing: 'ring-[#209A82]'
        },
        {
            id: 'Find People',
            title: 'Find My People',
            description: 'Deep socializing, venting, shared struggles.\n\nMatches you with walking-and-talking groups and post-workout coffee clubs built for real connection.',
            icon: HeartHandshake,
            bgImage: 'https://thumbs.dreamstime.com/b/female-athlete-chatting-other-participant-taking-break-339932071.jpg',
            overlay: 'from-[#364A9F] via-[#364A9F]/50 to-[#364A9F]/25',
            activeRing: 'ring-[#364A9F]'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative font-sans">
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {/* This is the raw SVG code for a thin, minimalistic temple */}
                        <svg
                            viewBox="0 0 100 100"
                            className="h-15 w-auto text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path d="M20 40 L50 20 L80 40" /> {/* Roof */}
                            <path d="M20 45 H80" />          {/* Top Base */}
                            <path d="M30 45 V75" />          {/* Left Column */}
                            <path d="M50 45 V75" />          {/* Middle Column */}
                            <path d="M70 45 V75" />          {/* Right Column */}
                            <path d="M20 80 H80" />          {/* Bottom Base */}
                        </svg>
                        <span className="font-bold text-2xl tracking-tight text-gray-900">Psychiki</span>
                    </div>
                </div>
                <button onClick={onSignOut} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Sign out
                </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 mt-16 lg:mt-0">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight">
                        What brings you here?
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Choose your primary focus. This helps us match you with the right micro-clubs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setSelectedFocus(opt.id)}
                            className={`relative h-[26rem] rounded-[2.5rem] overflow-hidden text-left transition-all duration-300 group hover:-translate-y-2
                ${selectedFocus === opt.id ? `ring-4 ring-offset-4 ${opt.activeRing} scale-[1.02]` : 'hover:shadow-2xl opacity-90 hover:opacity-100'}
              `}
                        >
                            <img
                                src={opt.bgImage}
                                alt={opt.title}
                                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${opt.overlay} z-10`}></div>

                            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white border border-white/20">
                                    <opt.icon size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{opt.title}</h3>
                                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line font-medium">
                                    {opt.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-12">
                    <button
                        onClick={() => {
                            if (selectedFocus) onComplete(selectedFocus);
                        }}
                        disabled={!selectedFocus}
                        className="px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-300
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              bg-[#18452B] text-white hover:bg-[#113320] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
