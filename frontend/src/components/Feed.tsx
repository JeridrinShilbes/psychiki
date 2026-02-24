import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { UserProfile, Club } from '../types';
import { ClubCard } from './ClubCard';
import { EventMap } from './EventMap';
import { EVENTS_API } from '../constants';
import { BentoHero } from './BentoHero';
import { EventForm } from './EventForm';
import { FilterBar } from './FilterBar';
import { RsvpModal } from './RsvpModal';

interface FeedProps {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}


export function Feed({ user, setUser, activeFilter, setActiveFilter }: FeedProps) {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [maxDistance, setMaxDistance] = useState<number>(100); // 100 equates to "Any"

    // Form States
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [rsvpModal, setRsvpModal] = useState<{ isOpen: boolean; club: Club | null }>({ isOpen: false, club: null });

    const filters = ['All Clubs', 'Burn Energy', 'Clear Head', 'Find People'];

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

    const filteredClubs = (activeFilter === 'All Clubs'
        ? clubsWithDistance
        : clubsWithDistance.filter(c => c.category === activeFilter))
        .filter(c => maxDistance === 100 || (c.distance === undefined || c.distance <= maxDistance));

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Premium Bento Grid Hero Section */}
            {!showCreateForm ? (
                <BentoHero userName={user.name} onHostClick={() => setShowCreateForm(true)} variants={itemVariants} />
            ) : null}

            {/* Create Event Form */}
            <AnimatePresence>
                {showCreateForm && (
                    <EventForm
                        userName={user.name}
                        selectedLocation={selectedLocation}
                        onSuccess={(club) => {
                            setClubs(prev => [club, ...prev]);
                            setShowCreateForm(false);
                            setSelectedLocation(null);
                        }}
                        onCancel={() => {
                            setShowCreateForm(false);
                            setSelectedLocation(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Filter Bar - Linear Style */}
            <FilterBar
                filters={filters}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                variants={itemVariants}
            />

            {/* Event Grid */}
            <motion.div variants={itemVariants} className="w-full">
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
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500 shadow-sm">No events found.</div>
                ) : viewMode === 'map' ? (
                    <div className="w-full h-full relative z-0">
                        <EventMap
                            events={filteredClubs}
                            onMapClick={handleMapClick}
                            onEventClick={(club) => setRsvpModal({ isOpen: true, club })}
                            userLocation={userLocation}
                            selectedLocation={selectedLocation}
                            hasJoined={(id) => !!user.joinedEvents?.includes(id)}
                        />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredClubs.map(club => (
                            <motion.div variants={itemVariants} key={club.id}>
                                <ClubCard
                                    club={club}
                                    onJoin={() => setRsvpModal({ isOpen: true, club })}
                                    currentUser={user.name}
                                    onDelete={handleDeleteEvent}
                                    hasJoined={user.joinedEvents?.includes(club.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Pre-RSVP Intent Modal */}
            <AnimatePresence>
                {rsvpModal.isOpen && rsvpModal.club && (
                    <RsvpModal
                        club={rsvpModal.club}
                        onClose={() => setRsvpModal({ isOpen: false, club: null })}
                        hasJoined={user.joinedEvents?.includes(rsvpModal.club.id)}
                        onJoinSuccess={(clubId) => {
                            setClubs(prev => prev.map(c => c.id === clubId ? { ...c, members: c.members + 1 } : c));
                            setUser({ ...user, joinedEvents: [...(user.joinedEvents || []), clubId] });
                            setRsvpModal({ isOpen: false, club: null });
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}