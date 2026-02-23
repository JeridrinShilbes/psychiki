import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { UserProfile } from '../types';
import { ALL_TAGS } from '../constants';
import { CategoryBadge } from './CategoryBadge';

interface ProfileProps {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}

export function Profile({ user, setUser }: ProfileProps) {
    // Added state for the user's name and editing mode
    const [localName, setLocalName] = useState<string>(user.name);
    const [isEditingName, setIsEditingName] = useState(false);

    const [localInterests, setLocalInterests] = useState<string[]>(user.interests);

    const toggleTag = (tag: string) => {
        if (localInterests.includes(tag)) {
            // Allow removing tags
            setLocalInterests(localInterests.filter(t => t !== tag));
        } else if (localInterests.length < 3) {
            // Only allow adding if we haven't reached the limit of 3
            setLocalInterests([...localInterests, tag]);
        }
    };

    const handleSave = () => {
        // Now saves both the updated name and the updated interests
        setUser({ ...user, name: localName, interests: localInterests });
        setIsEditingName(false); // Close the edit input if it was open
    };

    const toggleEditName = () => {
        if (isEditingName) {
            // If we are currently editing and click the button to finish, save the name to global state immediately
            setIsEditingName(false);
            setUser({ ...user, name: localName, interests: localInterests });
        } else {
            setIsEditingName(true);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
                <p className="text-gray-500">Fine-tune your details and micro-interests to get better club matches.</p>
            </div>

            {/* User Info Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                {/* Dynamic Avatar based on localName so it updates as you type */}
                <div className="w-20 h-20 shrink-0 bg-[#18452B] text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner">
                    {(localName || 'U').charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                className="text-xl font-bold text-gray-900 border-b-2 border-[#18452B] focus:outline-none bg-gray-50 px-2 py-1 rounded-t-md w-full max-w-[250px]"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && toggleEditName()}
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-gray-900">{localName}</h2>
                        )}

                        {/* Edit Name Button */}
                        <button
                            onClick={toggleEditName}
                            className="p-1.5 text-gray-400 hover:text-[#18452B] hover:bg-green-50 rounded-md transition-colors"
                            title={isEditingName ? "Done editing" : "Edit name"}
                        >
                            <Pencil size={16} />
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mb-3">{user.email}</p>

                    {/* Render Category Badge and Selected Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        <CategoryBadge category={user.primaryFocus} />
                        {localInterests.map(tag => (
                            <span key={`header-${tag}`} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Micro-Interests Section */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Micro-Interests</h3>
                        <p className="text-gray-500 text-sm mt-1">Select up to 3 tags that resonate with you. These shape your club recommendations.</p>
                    </div>
                    <div className={`text-sm font-medium ${localInterests.length === 3 ? 'text-[#18452B]' : 'text-gray-400'}`}>
                        {localInterests.length} / 3 selected
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                    {ALL_TAGS.map(tag => {
                        const isSelected = localInterests.includes(tag);
                        const isDisabled = !isSelected && localInterests.length >= 3;

                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected
                                    ? 'bg-[#18452B] text-white border-[#18452B] shadow-md shadow-green-900/10 scale-105'
                                    : isDisabled
                                        ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                {/* Main Save Button */}
                <div className="pt-6 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-[#18452B] hover:bg-[#113320] transition-colors shadow-lg shadow-green-900/20"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}