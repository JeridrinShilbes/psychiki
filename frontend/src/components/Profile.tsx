import { useState } from 'react';
import type { UserProfile } from '../types';
import { ALL_TAGS } from '../constants';
import { CategoryBadge } from './CategoryBadge';

interface ProfileProps {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}

export function Profile({ user, setUser }: ProfileProps) {
    const [localInterests, setLocalInterests] = useState<string[]>(user.interests);

    const toggleTag = (tag: string) => {
        if (localInterests.includes(tag)) {
            setLocalInterests(localInterests.filter(t => t !== tag));
        } else {
            setLocalInterests([...localInterests, tag]);
        }
    };

    const handleSave = () => {
        setUser({ ...user, interests: localInterests });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
                <p className="text-gray-500">Fine-tune your micro-interests to get better club matches.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-20 h-20 bg-[#18452B] text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500 text-sm mb-3">{user.email}</p>
                    <CategoryBadge category={user.primaryFocus} />
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Micro-Interests</h3>
                        <p className="text-gray-500 text-sm mt-1">Select tags that resonate with you. These shape your club recommendations.</p>
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                        {localInterests.length} selected
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                    {ALL_TAGS.map(tag => {
                        const isSelected = localInterests.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected
                                    ? 'bg-[#18452B] text-white border-[#18452B] shadow-md shadow-green-900/10 scale-105'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

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
