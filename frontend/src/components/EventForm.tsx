import { useState } from 'react';
import { motion } from 'framer-motion';
import { EVENTS_API } from '../constants';
import type { Club } from '../types';

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

interface EventFormProps {
    userName: string;
    selectedLocation: { lat: number, lng: number } | null;
    onSuccess: (club: Club) => void;
    onCancel: () => void;
}

export function EventForm({ userName, selectedLocation, onSuccess, onCancel }: EventFormProps) {
    const [isPosting, setIsPosting] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventCategory, setNewEventCategory] = useState('Burn Energy');
    const [imageDepartment, setImageDepartment] = useState<string>('Cardio');
    const [newEventTags, setNewEventTags] = useState('');
    const [newEventSchedule, setNewEventSchedule] = useState('');

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
            author: userName,
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
                onSuccess({ ...savedEvent, id: savedEvent.id || savedEvent._id });
            } else {
                alert("Failed to post event.");
            }
        } catch (err) {
            alert("Failed to post event.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden"
        >
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
                <div className="flex justify-end gap-3 mt-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors font-medium text-sm"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isPosting}
                        className="px-6 py-2.5 bg-black text-white font-medium text-sm rounded-xl disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
                    >
                        {isPosting ? 'Creating...' : 'Create Event'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}
