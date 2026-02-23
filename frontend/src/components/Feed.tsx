import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import type { UserProfile, Club } from '../types';
import { ClubCard } from './ClubCard';
import { EVENTS_API } from '../constants';

interface FeedProps {
    user: UserProfile;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    onJoin: (club: Club) => void;
}

// 1. Image pools for random selection based on Activity Type
const IMAGES_BY_CATEGORY: Record<string, string[]> = {
    'Cardio': [
        'https://images.unsplash.com/photo-1517836357463-d25dfe09ce14?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
    ],
    'Running': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=600'
    ],
    'Meditation': [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600'
    ]
};

export function Feed({ user, activeFilter, setActiveFilter, onJoin }: FeedProps) {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventCategory, setNewEventCategory] = useState('Burn Energy');
    const [imageDepartment, setImageDepartment] = useState<string>('Cardio');
    const [newEventTags, setNewEventTags] = useState('');
    const [newEventSchedule, setNewEventSchedule] = useState('');

    const filters = ['All Clubs', 'Burn Energy', 'Clear Head', 'Find People'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(EVENTS_API);
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();

            const formattedData = data.map((event: any) => ({
                ...event,
                id: event._id?.toString() || event.id
            }));
            setClubs(formattedData);
        } catch (err) {
            setError("The backend is waking up. Please wait or refresh in 30 seconds.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventTitle.trim() || !newEventDescription.trim()) return;

        setIsPosting(true);
        const pool = IMAGES_BY_CATEGORY[imageDepartment] || IMAGES_BY_CATEGORY['Cardio'];
        const randomImage = pool[Math.floor(Math.random() * pool.length)];

        const newEventData = {
            title: newEventTitle,
            description: newEventDescription,
            category: newEventCategory,
            tags: newEventTags.split(',').map(tag => tag.trim()).filter(Boolean),
            schedule: newEventSchedule || 'TBD',
            image: randomImage,
            members: 1,
            matchScore: 100,
            author: user.name
        };

        try {
            const response = await fetch(EVENTS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEventData),
            });

            if (response.ok) {
                const savedEvent = await response.json();
                setClubs(prev => [{ ...savedEvent, id: savedEvent.id || savedEvent._id }, ...prev]);
                resetForm();
            }
        } catch (err) {
            alert("Failed to post event.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteEvent = async (eventId: string, authorName: string) => {
        if (user.name !== authorName) {
            alert("Unauthorized.");
            return;
        }

        if (!window.confirm("Delete this event permanently?")) return;

        try {
            const response = await fetch(`${EVENTS_API}/${eventId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: user.name })
            });

            if (response.ok) {
                setClubs(prev => prev.filter(club => club.id !== eventId));
            } else {
                const data = await response.json();
                alert(data.message || "Delete failed.");
            }
        } catch (err) {
            alert("Server error during deletion.");
        }
    };

    const resetForm = () => {
        setNewEventTitle('');
        setNewEventDescription('');
        setNewEventCategory('Burn Energy');
        setNewEventTags('');
        setNewEventSchedule('');
        setShowCreateForm(false);
        setIsPosting(false);
    };

    const filteredClubs = activeFilter === 'All Clubs'
        ? clubs
        : clubs.filter(c => c.category === activeFilter);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Hey, {user.name}</h1>
                    <p className="text-gray-500 text-lg">Here are events matched to your vibe.</p>
                </div>
                {!showCreateForm && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-[#18452B] text-white font-medium rounded-xl hover:bg-[#123620] transition-colors shadow-sm"
                    >
                        <Plus size={20} className="mr-2" />
                        Start Event
                    </button>
                )}
            </div>

            {/* Create Event Form */}
            {showCreateForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Create a New Event</h2>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Event Title"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <select
                                value={newEventCategory}
                                onChange={(e) => setNewEventCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                                <option value="Burn Energy">Burn Energy</option>
                                <option value="Clear Head">Clear Head</option>
                                <option value="Find People">Find People</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Description"
                            value={newEventDescription}
                            onChange={(e) => setNewEventDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none"
                            rows={3}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Tags (e.g. #Hike, #Sun)"
                                value={newEventTags}
                                onChange={(e) => setNewEventTags(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Schedule (e.g. Sat 10AM)"
                                value={newEventSchedule}
                                onChange={(e) => setNewEventSchedule(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <select
                                value={imageDepartment}
                                onChange={(e) => setImageDepartment(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                                <option value="Cardio">Cardio Images</option>
                                <option value="Running">Running Images</option>
                                <option value="Meditation">Meditation Images</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button
                                type="submit"
                                disabled={isPosting}
                                className="px-6 py-2 bg-[#18452B] text-white rounded-xl disabled:opacity-50"
                            >
                                {isPosting ? 'Creating...' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-[#18452B]/20 outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeFilter === filter ? 'bg-[#18452B] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-[#18452B]" />
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-600">
                    <AlertCircle size={32} className="mx-auto mb-2" />
                    <p>{error}</p>
                </div>
            ) : filteredClubs.length === 0 ? (
                <div className="bg-white border rounded-2xl p-12 text-center text-gray-500">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.map(club => (
                        <ClubCard
                            key={club.id}
                            club={club}
                            onJoin={() => onJoin(club)}
                            currentUser={user.name}
                            onDelete={handleDeleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}