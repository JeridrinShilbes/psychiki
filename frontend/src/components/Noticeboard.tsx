import { useState, useEffect } from 'react';
import type { Notice } from '../types';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { NOTICES_API } from '../constants';

export function Noticeboard({ userName }: { userName: string }) {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    // Form state
    const [showPostForm, setShowPostForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const API_URL = NOTICES_API;

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Check if VITE_RENDER_SERVER_URL is defined
            if (!import.meta.env.VITE_RENDER_SERVER_URL || import.meta.env.VITE_RENDER_SERVER_URL === 'undefined') {
                // For development without a backend, use mock data temporarily
                // so the UI can be built and tested.
                setNotices([
                    {
                        id: 1,
                        title: "Looking for a tennis partner!",
                        content: "I'm a beginner looking to play some relaxed matches on weekends at the local park. Let me know if you're interested!",
                        author: "Alex",
                        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
                    },
                    {
                        id: 2,
                        title: "Group Run this Saturday",
                        content: "Doing a 5k loop around the lake this Saturday morning at 8am. All paces welcome, we will grab coffee afterwards.",
                        author: "Sarah",
                        createdAt: new Date(Date.now() - 86400000).toISOString()
                    }
                ]);
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('psychiki_token');
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(API_URL, { headers });
            if (!response.ok) {
                throw new Error(`Failed to fetch notices: ${response.statusText}`);
            }
            const data = await response.json();
            setNotices(data);
        } catch (err) {
            console.error("Error fetching notices:", err);
            setError("Could not load notices. The backend might be unavailable.");
            // Fallback mock data purely for visual development if backend is not up yet
            setNotices([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        setIsPosting(true);

        const newNoticeData = {
            title: newTitle,
            content: newContent,
            author: userName
        };

        try {
            if (!import.meta.env.VITE_RENDER_SERVER_URL || import.meta.env.VITE_RENDER_SERVER_URL === 'undefined') {
                // Mock posting if no backend is configured yet
                setTimeout(() => {
                    const mockNewNotice: Notice = {
                        id: Math.random(),
                        title: newTitle,
                        content: newContent,
                        author: userName,
                        createdAt: new Date().toISOString()
                    };
                    setNotices([mockNewNotice, ...notices]);
                    setNewTitle('');
                    setNewContent('');
                    setShowPostForm(false);
                    setIsPosting(false);
                }, 500);
                return;
            }

            const token = localStorage.getItem('psychiki_token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(newNoticeData),
            });

            if (!response.ok) {
                throw new Error("Failed to post notice");
            }

            const postedNotice = await response.json();
            // Assuming the backend returns the created notice
            setNotices([postedNotice, ...notices]);

            // Reset form
            setNewTitle('');
            setNewContent('');
            setShowPostForm(false);
        } catch (err) {
            console.error("Error posting notice:", err);
            alert("Failed to post notice. Please try again.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Noticeboard</h1>
                    <p className="mt-2 text-lg text-gray-600">Connect with others, post events, or see what's happening around you.</p>
                </div>
                {!showPostForm && (
                    <button
                        onClick={() => setShowPostForm(true)}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white font-medium rounded-xl hover:from-black hover:to-gray-900 transition-colors shadow-sm self-start sm:self-auto"
                    >
                        <Plus size={20} className="mr-2" />
                        Post a Notice
                    </button>
                )}
            </div>

            {/* Post Notice Form */}
            {showPostForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Create a New Notice</h2>
                    <form onSubmit={handlePostNotice} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="e.g., Weekend Hike at Bear Mountain"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                required
                                disabled={isPosting}
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                            <textarea
                                id="content"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Share the details... when, where, and what to bring?"
                                rows={4}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                                required
                                disabled={isPosting}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowPostForm(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                disabled={isPosting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPosting || !newTitle.trim() || !newContent.trim()}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-gray-900 to-black text-white font-medium rounded-xl hover:from-black hover:to-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isPosting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        Posting...
                                    </>
                                ) : (
                                    'Post Notice'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Notice List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-green-600 mb-4" />
                    <p className="text-gray-500 font-medium">Loading notices...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <AlertCircle size={32} className="text-red-500 mb-3" />
                    <h3 className="text-lg font-bold text-red-800 mb-1">Oops!</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchNotices}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : notices.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500">
                    <p className="text-lg">No notices posted yet.</p>
                    <p className="text-sm mt-1">Be the first to share something with the community!</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {notices.map((notice) => (
                        <div key={notice.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#18452B] transition-colors">{notice.title}</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Posted by {notice.author}</span>
                                <span>{new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
