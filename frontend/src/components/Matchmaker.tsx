import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Club } from '../types';
import { apiKey } from '../constants';

interface MatchmakerProps {
    onMatchmakerComplete: () => void;
}

export function Matchmaker({ onMatchmakerComplete }: MatchmakerProps) {
    const [feeling, setFeeling] = useState<string>('');
    const [goals, setGoals] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const generateClubs = async () => {
        if (!feeling || !goals) {
            setError('Please fill in both fields so we can find the best match.');
            return;
        }
        setError('');
        setIsGenerating(true);

        const systemPrompt = `You are the Community Matchmaker for a holistic health platform. Your goal is to analyze a user's current physical and mental wellness goals and suggest 3 highly specific 'Micro-Clubs' they should join.

A 'Psychiki' must combine a physical activity with a mental/social component. Do not suggest generic groups like 'Running Club' or 'Meditation Group.' Instead, suggest hyper-specific, welcoming concepts (e.g., 'Zen Lifters' for weightlifting followed by mindfulness, 'Pace & Ponder' for brisk walking while discussing audiobooks).

Tone: Empathetic, highly encouraging, non-judgmental, and community-focused. You are not a doctor; do not give medical or psychiatric advice. Focus entirely on community, routine building, and shared experiences.

Based on the user's feelings and goals, generate exactly 3 clubs.`;

        const userPrompt = `User Feeling: ${feeling}\nUser Goals: ${goals}\nRecommend their clubs now.`;

        try {
            const fetchWithRetry = async (url: string, options: RequestInit, retries = 5): Promise<any> => {
                let delay = 1000;
                for (let i = 0; i < retries; i++) {
                    try {
                        const res = await fetch(url, options);
                        if (!res.ok) {
                            const errText = await res.text();
                            console.error(errText);
                            throw new Error(`HTTP ${res.status}`);
                        }
                        return await res.json();
                    } catch (e) {
                        if (i === retries - 1) throw e;
                        await new Promise(r => setTimeout(r, delay));
                        delay *= 2;
                    }
                }
            };

            const url =
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text:
                                    systemPrompt +
                                    "\n\n" +
                                    userPrompt +
                                    "\n\nReturn ONLY valid JSON in this format:\n" +
                                    JSON.stringify({
                                        clubs: [
                                            {
                                                title: "string",
                                                description: "string",
                                                tags: ["string"],
                                                category: "Burn Energy | Clear Head | Find People",
                                                schedule: "string"
                                            }
                                        ]
                                    })
                            }
                        ]
                    }
                ]
            };

            const result = await fetchWithRetry(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error("No valid response from AI");

            const cleanText = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const parsed = JSON.parse(cleanText);

            const newClubs: Club[] = parsed.clubs.map((c: any, i: number) => {
                const images: Record<string, string[]> = {
                    'Burn Energy': ['https://images.unsplash.com/photo-1517836357463-d25dfe09ce14?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600'],
                    'Clear Head': ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'],
                    'Find People': ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600']
                };
                const catImages = images[c.category] || images['Clear Head'];
                const randomImage = catImages[Math.floor(Math.random() * catImages.length)];

                return {
                    id: Date.now() + i,
                    title: c.title,
                    description: c.description,
                    category: ['Burn Energy', 'Clear Head', 'Find People'].includes(c.category) ? c.category : 'Clear Head',
                    tags: c.tags.slice(0, 4),
                    schedule: c.schedule || 'Schedule TBD',
                    members: Math.floor(Math.random() * 20) + 5,
                    image: randomImage,
                    matchScore: 99
                };
            });

            // Post the newly generated clubs to the backend
            const API_URL = import.meta.env.VITE_RENDER_SERVER_URL + '/api/events';

            if (import.meta.env.VITE_RENDER_SERVER_URL && import.meta.env.VITE_RENDER_SERVER_URL !== 'undefined') {
                for (const club of newClubs) {
                    try {
                        await fetch(API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(club)
                        });
                    } catch (postErr) {
                        console.error("Failed to post generated club details:", postErr);
                    }
                }
            }

            onMatchmakerComplete();

        } catch (err) {
            console.error(err);
            setError("We couldn't generate matches right now. Please try again or check your API key setup.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-green-100 text-[#18452B] rounded-full text-xs font-bold mb-2">
                    <Sparkles size={12} className="mr-1 inline" /> AI-Powered
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Matchmaker</h1>
                <p className="text-gray-500">
                    Tell us how you're feeling and what you need. We'll suggest hyper-specific micro-clubs just for you.
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">How are you feeling right now?</label>
                    <textarea
                        rows={3}
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-gray-50/50 resize-none"
                        placeholder="e.g., Stressed from work, need to decompress... or full of energy and want to sweat."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">What are your goals this week?</label>
                    <textarea
                        rows={3}
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-gray-50/50 resize-none"
                        placeholder="e.g., Build a consistent workout routine, meet new people, get out of my head."
                    />
                </div>

                <button
                    onClick={generateClubs}
                    disabled={isGenerating}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-[#18452B] hover:bg-[#113320] transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Finding your tribe...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} /> Find My Clubs
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
