import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { AUTH_API } from '../constants';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (token: string, user: any) => void;
}

type AuthMode = 'login' | 'register' | 'verify';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setUsername('');
        setOtp('');
        setError('');
        setSuccessMsg('');
        setMode('login');
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleSubmitAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        const url = `${AUTH_API}/${mode === 'login' ? 'login' : 'register'}`;

        const payload = mode === 'login'
            ? { email, password }
            : { email, password, username };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                // If the user tries to login but is not verified, standard flow triggers OTP resend.
                if (data.requiresVerification) {
                    setMode('verify');
                    setSuccessMsg('Please enter the verification code sent to your email.');
                    return;
                }
                throw new Error(data.message || 'Authentication failed');
            }

            if (mode === 'register') {
                // Registration successful, OTP sent
                setMode('verify');
                setSuccessMsg('Registration successful! Please check your email for the verification code.');
            } else {
                // Login successful (User is verified)
                onSuccess(data.token, data.user);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        const url = `${AUTH_API}/verify-otp`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            // Verification successful, returns token and user
            onSuccess(data.token, data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
                        {mode === 'login' && 'Welcome back'}
                        {mode === 'register' && 'Create an account'}
                        {mode === 'verify' && 'Verify your email'}
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        {mode === 'login' && 'Enter your details to sign in.'}
                        {mode === 'register' && 'Join the global community today.'}
                        {mode === 'verify' && 'We sent a 6-digit code to your email.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 text-emerald-700 text-sm font-medium border border-green-100 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400">
                        {successMsg}
                    </div>
                )}

                {mode === 'verify' ? (
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 text-center">6-Digit Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                className="w-full text-center tracking-widest text-2xl px-4 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                                placeholder="000000"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || otp.length < 6}
                            className="w-full py-4 mt-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verifying...' : <>Confirm Code <ArrowRight size={18} /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmitAuth} className="space-y-5">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                                    placeholder="johndoe"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>
                )}

                {/* Footer Toggles */}
                <div className="mt-8 text-center space-y-3">
                    {mode === 'verify' ? (
                        <button
                            onClick={() => {
                                setMode('login');
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                        >
                            Back to sign in
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login');
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                        >
                            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
