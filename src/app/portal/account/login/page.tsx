'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CircleNotch as Loader2, Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { createClient } from '@/utils/supabase/client';
import { signInWithEmailAndPassword } from '../actions';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await signInWithEmailAndPassword(email, password);

            if (result?.error) {
                setMessage({ type: 'error', text: result.error });
                setIsLoading(false);
                return;
            }

            if (result?.success) {
                router.push('/portal/dashboard');
                // Clean up any old simulated session
                localStorage.removeItem('sykli_user');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setMessage({
                type: 'error',
                text: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-[#2d2d2d]">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-neutral-500 mb-8">Sign in to your application portal</p>

            {message && (
                <div className={`p-4 rounded-lg mb-6 text-xs font-bold uppercase tracking-widest border ${message.type === 'success' ? 'bg-neutral-50 text-neutral-900 border-neutral-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-[#2d2d2d]"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-[#2d2d2d] pr-12"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                        >
                            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <p className="text-neutral-500 text-sm">
                    Don't have an account yet?{' '}
                    <Link href="/portal/account/register" className="text-black font-bold hover:underline">
                        Start your application
                    </Link>
                </p>
            </div>
        </div>
    );
}
