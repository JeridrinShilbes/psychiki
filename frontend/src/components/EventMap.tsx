import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

interface EventMapProps {
    events: Club[];
    onMapClick: (lat: number, lng: number) => void;
    onEventClick: (event: Club) => void;
    userLocation: [number, number] | null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export function EventMap({ events, onMapClick, onEventClick, userLocation }: EventMapProps) {
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

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative z-0">
            {/* We key the map by the center string to force re-render when location is found, letting it snap to the user */}
            <MapContainer
                key={userLocation ? "user-loc" : "default-loc"}
                center={center as [number, number]}
                zoom={13}
                className="w-full h-full"
                style={{ zIndex: 0 }}
            >
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <MapClickHandler onMapClick={onMapClick} />

                {/* AI Assistant Marker */}
                <Marker
                    position={[51.5361, -0.1251]}
                    icon={createCustomIcon('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop')}
                >
                    <Popup className="custom-popup">
                        <div className="p-4 text-center bg-white h-full">
                            <div className="font-bold text-gray-900 text-base">🤖 Your AI Assistant</div>
                            <div className="text-xs text-gray-500 mt-1">Google DeepMind, London</div>
                        </div>
                    </Popup>
                </Marker>

                {events.map((event) => {
                    const position = getEventPosition(event);
                    return (
                        <Marker
                            key={event.id}
                            position={position}
                            icon={createCustomIcon(event.image)}
                        >
                            <Popup className="custom-popup">
                                <div className="flex flex-col bg-white overflow-hidden w-full h-full">
                                    <div className="h-32 w-full relative">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    <div className="p-4 bg-white flex flex-col items-center text-center">
                                        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{event.title}</h3>
                                        {event.distance !== undefined && (
                                            <p className="text-xs font-semibold tracking-wide text-gray-500 mb-4">{event.distance.toFixed(1)} km away</p>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick(event);
                                            }}
                                            className="w-full py-2.5 bg-[#18452B] text-white text-sm font-bold rounded-xl hover:bg-[#123620] transition-colors shadow-sm"
                                        >
                                            Join Event
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
