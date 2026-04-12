
'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeSlash } from "@phosphor-icons/react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    const handleSignUp = async () => {
        // Quick dev helper to create a user if none exists
        // In production, this would be disabled or protected
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            setError(error.message);
        } else {
            setError('Account created! You can now log in.');
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-neutral-900">Admin Login</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-neutral-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-semibold mb-1 text-neutral-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Log In'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSignUp}
                        className="w-full text-neutral-500 text-sm hover:text-neutral-900 mt-2"
                    >
                        Create Account (Dev Only)
                    </button>
                </form>
            </div>
        </div>
    );
}
