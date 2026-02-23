import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, AlertCircle, Map as MapIcon, Grid as GridIcon } from 'lucide-react';
import type { UserProfile, Club } from '../types';
import { ClubCard } from './ClubCard';
import { EventMap } from './EventMap';
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
        'https://youfit.com/wp-content/uploads/2024/04/YouFit-Oakland-Park-02-22-23_046-Edit.jpg',
        'https://blog.muscleblaze.com/wp-content/uploads/2024/12/Artboard-3.png'
    ],
    'Running': [
        'https://hips.hearstapps.com/hmg-prod/images/happy-and-joggers-royalty-free-image-1696346737.jpg?crop=0.88847xw:1xh;center,top&resize=1200:*',
        'https://i.natgeofe.com/n/e044eb85-f74d-4ba9-8958-d875f5183f66/h_16089728.jpg'
    ],
    'Meditation': [
        'https://img.freepik.com/free-photo/yoga-class-concept_53876-47114.jpg',
        'https://img.freepik.com/free-photo/group-young-sporty-people-sitting-sukhasana-exercise_1163-4940.jpg?w=360'
    ],
    'Weight Training': [
        'https://hips.hearstapps.com/hmg-prod/images/strength-training-66ed958d3de94.jpg?crop=0.670xw:1.00xh;0.111xw,0&resize=1200:*',
        'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2022/11/Strength-training-programs.jpg?fit=1988%2C1327&ssl=1'
    ],
    'Hiking': [
        'https://www.pcta.org/wp-content/uploads/2015/12/how-many-people-hike-the-pacific-crest-trail.jpg',
        'https://adventures.com/media/9939/hiking-trek-group-people.jpg'
    ],
    'Swimming': [
        'https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_lg/f_auto/primary/piultz6nngltq541xmju',
        'https://plus.unsplash.com/premium_photo-1661855484909-b76b427d0f9b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3dpbW1pbmclMjBjb21wZXRpdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
    ],
    'Cycling': [
        'https://cdn.shopify.com/s/files/1/0551/0388/1250/files/cycling_benefits_styrkr.jpg?v=1676894320',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3ljbGluZ3xlbnwwfHwwfHx8MA%3D%3D'
    ],
    'Pilates': [
        'https://images.ctfassets.net/ipjoepkmtnha/5nTW9GvNYKtjJukcotDgji/c9cffb3fb04dfe4e7407153f371054dd/TG_REFORM_TechnoGym_Classe_-_12_1198_ADV__1_.jpg',
        'https://thecore.pilates.com/wp-content/uploads/2024/09/2409-Pilates-for-Athletes_A-Whole-Body-Approach_Core-Feature-1536x937.jpg'
    ],
    'Sports': [
        'https://ffprod.blob.core.windows.net/media/Boys%20playing_0-optimised_5-optimised.jpg',
        'https://media.istockphoto.com/id/884279594/photo/athlete-in-action.jpg?s=612x612&w=0&k=20&c=bjlDnHrZSx8WzA8K8wUXXzPGuolhhHTEzjtQ3lFnHW8='
    ],
    'Other': [
        'https://i1.sndcdn.com/artworks-lGFo9Z2ozhGXb18z-oBoI3g-t500x500.jpg'
    ]
};

export function Feed({ user, activeFilter, setActiveFilter, onJoin }: FeedProps) {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    // Form States
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventCategory, setNewEventCategory] = useState('Burn Energy');
    const [imageDepartment, setImageDepartment] = useState<string>('Cardio');
    const [newEventTags, setNewEventTags] = useState('');
    const [newEventSchedule, setNewEventSchedule] = useState('');

    const filters = ['All Clubs', 'Closest 5', 'Burn Energy', 'Clear Head', 'Find People'];

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            }, (error) => {
                console.error("Error getting location: ", error);
            });
        }
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
            author: user.name,
            ...(selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : {})
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
        console.log(user.name);
        console.log(authorName);
        if (user.name !== authorName) {
            alert("Unauthorized.");
            return;
        }

        if (!window.confirm("Delete this event permanently?")) return;

        try {
            const response = await fetch(`${EVENTS_API}/${eventId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-user-name': user.name },
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
        setNewEventCategory('Cardio');
        setNewEventTags('');
        setNewEventSchedule('');
        setShowCreateForm(false);
        setIsPosting(false);
        setSelectedLocation(null);
    };

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
        setShowCreateForm(true);
    };

    const getEventPosition = (event: Club): [number, number] => {
        if (event.lat && event.lng) return [event.lat, event.lng];
        // Deterministic offset based on ID
        const baseCenter = userLocation || [51.505, -0.09];
        let hash = 0;
        const str = event.id ? event.id.toString() : event.title;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const offsetLat = (Math.abs(hash) % 100) / 1000 - 0.05; // -0.05 to +0.05
        const offsetLng = (Math.abs(hash * 13) % 100) / 1000 - 0.05;
        return [baseCenter[0] + offsetLat, baseCenter[1] + offsetLng];
    };

    // Calculate distance for all clubs if userLocation is available
    const clubsWithDistance = clubs.map(club => {
        if (!userLocation) return club;
        const [eventLat, eventLng] = getEventPosition(club);
        const distance = calculateDistance(userLocation[0], userLocation[1], eventLat, eventLng);
        return { ...club, distance };
    });

    const filteredClubs = activeFilter === 'All Clubs'
        ? clubsWithDistance
        : activeFilter === 'Closest 5'
            ? [...clubsWithDistance].sort((a, b) => (a.distance || 0) - (b.distance || 0)).slice(0, 5)
            : clubsWithDistance.filter(c => c.category === activeFilter);

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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Create a New Event {selectedLocation ? '(with map location)' : ''}
                    </h2>
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
                                <option value="Cardio">Cardio</option>
                                <option value="Running">Running</option>
                                <option value="Meditation">Meditation</option>
                                <option value="Weight Training">Weight Training</option>
                                <option value="Hiking">Hiking</option>
                                <option value="Swimming">Swimming</option>
                                <option value="Cycling">Cycling</option>
                                <option value="Pilates">Pilates</option>
                                <option value="Martial Arts">Martial Arts</option>
                                <option value="Sports">Sports</option>
                                <option value="Other">Other</option>
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

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl ml-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#18452B]' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Grid View"
                    >
                        <GridIcon size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-[#18452B]' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Map View"
                    >
                        <MapIcon size={20} />
                    </button>
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
            ) : viewMode === 'map' ? (
                <EventMap events={filteredClubs} onMapClick={handleMapClick} onEventClick={onJoin} userLocation={userLocation} />
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