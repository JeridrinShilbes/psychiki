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

export function Feed({ user, activeFilter, setActiveFilter, onJoin }: FeedProps) {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Default it to whichever department makes the most sense
const [imageDepartment, setImageDepartment] = useState<string>('Burn Energy');

    // Create Event state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventCategory, setNewEventCategory] = useState('Burn Energy');
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
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        // MongoDB returns _id, but your ClubCard likely uses .id
        // We map them here so your existing components don't break
        const formattedData = data.map((event: any) => ({
            ...event,
            id: event._id || event.id 
        }));

        setClubs(formattedData);
    } catch (err) {
        console.error("Fetch error:", err);
        setError("The backend is taking a moment to wake up. Please wait or refresh in 30 seconds.");
    } finally {
        setIsLoading(false);
    }
};

// 1. Define image pools for each category
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

// 2. Update the handleCreateEvent function
const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDescription.trim()) return;

    setIsPosting(true);

    // Get the pool for the specifically selected image department dropdown
    const pool = IMAGES_BY_CATEGORY[imageDepartment] || IMAGES_BY_CATEGORY['Burn Energy'];
    
    // Select a random image from that specific pool
    const randomImage = pool[Math.floor(Math.random() * pool.length)];

    const newEventData = {
        title: newEventTitle,
        description: newEventDescription,
        category: newEventCategory, // Event category stays independent
        tags: newEventTags.split(',').map(tag => tag.trim()).filter(Boolean),
        schedule: newEventSchedule || 'TBD',
        image: randomImage, // Assign the random department-specific image
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
            
            // Transform the MongoDB _id to id so the UI/Key props don't break
            const formattedEvent = {
                ...savedEvent,
                id: savedEvent._id 
            };

            setClubs(prevClubs => [formattedEvent, ...prevClubs]);
            resetForm();
            // Optional: reset imageDepartment to default here if needed
        }
    } catch (err) {
        console.error("Error posting event:", err);
        alert("Failed to post event. Please check if the Render backend is awake!");
    } finally {
        setIsPosting(false);
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Hey, {user.name}</h1>
                    <p className="text-gray-500 text-lg">Here are events matched to your vibe. You can also start your own event.</p>
                </div>
                {!showCreateForm && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-[#18452B] text-white font-medium rounded-xl hover:bg-[#123620] transition-colors shadow-sm self-start sm:self-auto"
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                placeholder="e.g., Weekend Hike"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                required
                                disabled={isPosting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={newEventCategory}
                                onChange={(e) => setNewEventCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                disabled={isPosting}
                            >
                                <option value="Burn Energy">Burn Energy</option>
                                <option value="Clear Head">Clear Head</option>
                                <option value="Find People">Find People</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={newEventDescription}
                            onChange={(e) => setNewEventDescription(e.target.value)}
                            placeholder="What is this event about?"
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                            required
                            disabled={isPosting}
                        />
                    </div>

                    {/* Updated Grid: Now contains Tags, Schedule, and Image Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={newEventTags}
                                onChange={(e) => setNewEventTags(e.target.value)}
                                placeholder="e.g., #Hiking, #Outdoors"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                disabled={isPosting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                            <input
                                type="text"
                                value={newEventSchedule}
                                onChange={(e) => setNewEventSchedule(e.target.value)}
                                placeholder="e.g., Saturday at 10 AM"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                disabled={isPosting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                            <select
                                value={imageDepartment}
                                onChange={(e) => setImageDepartment(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                disabled={isPosting}
                            >
                                {/* Make sure these values map exactly to the keys in your IMAGES_BY_CATEGORY object */}
                                <option value="Cardio">Cardio</option>
                                <option value="Running">Running</option>
                                <option value="Meditation">Meditation</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                            disabled={isPosting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPosting || !newEventTitle.trim() || !newEventDescription.trim()}
                            className="inline-flex items-center px-6 py-2 bg-[#18452B] text-white font-medium rounded-xl hover:bg-[#123620] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isPosting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Event'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events, tags..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18452B]/20 focus:border-[#18452B] transition-all bg-white shadow-sm"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeFilter === filter
                                ? 'bg-[#18452B] text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-[#18452B] mb-4" />
                    <p className="text-gray-500 font-medium">Loading events...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <AlertCircle size={32} className="text-red-500 mb-3" />
                    <h3 className="text-lg font-bold text-red-800 mb-1">Oops!</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredClubs.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500">
                    <p className="text-lg">No events found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.map(club => (
                        <ClubCard key={club.id} club={club} onJoin={() => onJoin(club)} />
                    ))}
                </div>
            )}
        </div>
    );
}
