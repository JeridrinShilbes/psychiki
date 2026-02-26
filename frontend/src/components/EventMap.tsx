import { useState } from 'react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup } from 'react-leaflet';
import Map, { Marker as MapboxMarker } from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import L from 'leaflet';
import type { Club } from '../types';

// Helper to create circular avatar markers from event images
const createCustomIcon = (imageUrl: string) => {
    return L.divIcon({
        className: 'custom-avatar-marker',
        html: `<img src="${imageUrl}" alt="Marker" />`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22]
    });
};

const blueDotIcon = L.divIcon({
    className: 'custom-blue-dot',
    html: `<div style="width: 16px; height: 16px; background-color: #4285F4; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});

interface EventMapProps {
    events: Club[];
    onEventClick: (event: Club) => void;
    userLocation: [number, number] | null;
}

// Reusable interior component for Leaflet popups
const EventPopupCard = ({ event, onEventClick }: { event: Club; onEventClick: (event: Club) => void }) => (
    <div
        className="flex flex-col bg-white overflow-hidden w-full h-full cursor-pointer hover:bg-gray-50 transition-colors group"
        onClick={(e) => {
            e.stopPropagation();
            onEventClick(event);
        }}
    >
        <div className="h-28 w-full relative">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3">
                <h3 className="font-bold text-white text-[15px] leading-tight line-clamp-2 drop-shadow-md">{event.title}</h3>
            </div>
        </div>
        <div className="p-3 bg-white flex flex-col items-start w-full">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                <span>{event.category}</span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium mb-1 line-clamp-1">{event.schedule} • {event.members} Joined</p>

            {event.distance !== undefined && (
                <p className="text-[11px] font-semibold text-gray-400 mt-2">{event.distance.toFixed(1)} km away</p>
            )}

            <div className="w-full mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[#18452B]">
                <span className="text-[11px] font-bold">View Details</span>
                <span className="text-[14px] font-bold group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
    </div>
);

export function EventMap({ events, onEventClick, userLocation }: EventMapProps) {
    const [mapboxError, setMapboxError] = useState(false);
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

    // Default center as fallback, but we will try to get the user's location
    const center = userLocation || [51.505, -0.09];

    // Helper to render events even if they don't have lat/lng yet
    const getEventPosition = (event: Club): [number, number] => {
        if (event.lat && event.lng) return [event.lat, event.lng];
        // Deterministic offset based on ID
        let hash = 0;
        const str = event.id ? event.id.toString() : event.title;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const offsetLat = (Math.abs(hash) % 100) / 1000 - 0.05; // -0.05 to +0.05
        const offsetLng = (Math.abs(hash * 13) % 100) / 1000 - 0.05;
        return [center[0] + offsetLat, center[1] + offsetLng];
    };

    const renderLeafletMap = () => {
        return (
            <MapContainer
                key={userLocation ? "user-loc" : "default-loc"}
                center={center as [number, number]}
                zoom={13}
                className="w-full h-full"
                style={{ zIndex: 0 }}
            >
                <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                {/* AI Assistant Marker */}
                <LeafletMarker
                    position={[51.5361, -0.1251]}
                    icon={createCustomIcon('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop')}
                >
                    <LeafletPopup className="custom-popup">
                        <div className="p-4 text-center bg-white h-full">
                            <div className="font-bold text-gray-900 text-base">🤖 Your AI Assistant</div>
                            <div className="text-xs text-gray-500 mt-1">Google DeepMind, London</div>
                        </div>
                    </LeafletPopup>
                </LeafletMarker>

                {/* User Location Marker */}
                {userLocation && (
                    <LeafletMarker position={userLocation} icon={blueDotIcon}>
                        <LeafletPopup className="custom-popup">
                            <div className="font-bold text-gray-900 p-2">You are here</div>
                        </LeafletPopup>
                    </LeafletMarker>
                )}

                {events.map((event) => {
                    const position = getEventPosition(event);
                    return (
                        <LeafletMarker
                            key={event.id}
                            position={position}
                            icon={createCustomIcon(event.image)}
                        >
                            <LeafletPopup className="custom-popup">
                                <EventPopupCard event={event} onEventClick={onEventClick} />
                            </LeafletPopup>
                        </LeafletMarker>
                    );
                })}
            </MapContainer>
        );
    };

    const renderMapboxGlobe = () => {
        return (
            <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                    longitude: center[1],
                    latitude: center[0],
                    zoom: 1.5 // Zoomed out for globe view
                }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                projection={{ name: 'globe' }}
                style={{ width: '100%', height: '100%' }}
                onError={(e: any) => {
                    console.error("Mapbox load error", e);
                    setMapboxError(true);
                }}
                fog={{
                    color: 'rgb(186, 210, 235)', // Lower atmosphere
                    'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                    'horizon-blend': 0.02, // Atmosphere thickness
                    'space-color': 'rgb(11, 11, 25)', // Background color
                    'star-intensity': 0.6 // Background star brightness
                }}
            >
                {/* AI Assistant Marker */}
                <MapboxMarker longitude={-0.1251} latitude={51.5361} anchor="bottom">
                    <div className="relative group cursor-pointer w-11 h-11">
                        <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover border-2 border-white shadow-md relative z-10" alt="AI Agent" />
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl w-48 p-3 pointer-events-none z-50">
                            <div className="font-bold text-gray-900 text-sm text-center">🤖 Your AI Assistant</div>
                            <div className="text-[10px] text-gray-500 mt-1 text-center">Google DeepMind, London</div>
                        </div>
                    </div>
                </MapboxMarker>

                {/* User Location Marker */}
                {userLocation && (
                    <MapboxMarker longitude={userLocation[1]} latitude={userLocation[0]} anchor="center">
                        <div className="w-4 h-4 rounded-full bg-[#4285F4] border-[3px] border-white shadow-sm cursor-pointer group">
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white p-2 text-xs font-bold rounded-md shadow whitespace-nowrap z-50">
                                You are here
                            </div>
                        </div>
                    </MapboxMarker>
                )}

                {/* Events Markers */}
                {events.map((event) => {
                    const position = getEventPosition(event);
                    return (
                        <MapboxMarker
                            key={event.id}
                            longitude={position[1]}
                            latitude={position[0]}
                            anchor="bottom"
                        >
                            <div className="relative group cursor-pointer w-11 h-11 pointer-events-auto">
                                <img src={event.image} className="w-full h-full rounded-full object-cover border-2 border-white shadow-md relative z-10 hover:scale-110 transition-transform" alt={event.title} />

                                {/* Hover Popup Reimplemented in Mapbox Space */}
                                <div
                                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
                                    style={{ width: '220px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick(event);
                                    }}
                                >
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100">
                                        <div className="h-24 w-full relative">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-2 left-3 right-3">
                                                <h3 className="font-bold text-white text-[13px] leading-tight line-clamp-2 drop-shadow-md">{event.title}</h3>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white flex flex-col items-start w-full">
                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 mb-1">
                                                <span>{event.category}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium mb-1 line-clamp-1">{event.schedule} • {event.members} Joined</p>
                                            {event.distance !== undefined && (
                                                <p className="text-[10px] font-semibold text-gray-400 mt-1">{event.distance.toFixed(1)} km away</p>
                                            )}
                                            <div className="w-full mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[#18452B]">
                                                <span className="text-[10px] font-bold">View Details</span>
                                                <span className="text-[12px] font-bold">→</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Triangle arrow pointing down to marker */}
                                    <div className="w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100 absolute -bottom-1.5 left-1/2 -translate-x-1/2 shadow-sm"></div>
                                </div>
                            </div>
                        </MapboxMarker>
                    );
                })}
            </Map>
        );
    };

    return (
        <div className="w-full aspect-square overflow-hidden shadow-sm border border-gray-100 relative z-0">
            {MAPBOX_TOKEN && !mapboxError ? renderMapboxGlobe() : renderLeafletMap()}
        </div>
    );
}
