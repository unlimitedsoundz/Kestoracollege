'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOut as LogOut, Layout, User, FileText, CaretRight as ChevronRight, List as Menu, X, GraduationCap, House as Home, BookOpen, Buildings as Building2, CreditCard, Calendar } from "@phosphor-icons/react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Logo } from '@/components/ui/Logo';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { Plus, Minus } from "@phosphor-icons/react";

export default function PortalHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Client-side state for user data
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [studentId, setStudentId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserEmail(user.email);

                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('student_id, first_name, avatar_url')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        setFirstName(profile.first_name);
                        setAvatarUrl(profile.avatar_url);
                        setStudentId(profile.student_id);
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 64) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);
    const isAccountPage = pathname.startsWith('/portal/account');
    const isLoggedIn = !!userEmail;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('sykli_user');
        router.push('/portal/account/login');
        router.refresh();
        window.dispatchEvent(new Event('storage'));
    };

    const navItems = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: Layout },
        { name: 'My Profile', href: '/portal/account', icon: User },
    ];

    const mobileNavItems = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: Home },
        { name: 'Courses', href: '/portal/student/courses', icon: BookOpen },
        { name: 'Timetable', href: '/portal/student/timetable', icon: Calendar },
        { name: 'Housing', href: '/portal/student/housing', icon: Building2 },
        { name: 'My Profile', href: '/portal/account', icon: User },
    ];

    return (
        <>
            <header className={`bg-white sticky top-0 z-50 border-b border-black transition-transform duration-300 ${isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Logo className="h-12 md:h-14" />

                        <nav className="hidden md:flex items-center gap-1">
                            {isLoggedIn && navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-widest transition-colors ${isActive
                                            ? 'bg-neutral-100 text-black'
                                            : 'text-black hover:opacity-70 hover:bg-neutral-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Hamburger Menu Button - Mobile Only */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-black hover:opacity-70 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} weight="regular" /> : <Menu size={24} weight="regular" />}
                        </button>

                        {isAccountPage && (
                            <button
                                onClick={isLoggedIn ? handleSignOut : () => router.push('/portal/account/login')}
                                className="hidden md:block px-2 py-1 text-black hover:opacity-50 text-xs font-semibold uppercase tracking-widest transition-all"
                            >
                                {isLoggedIn ? 'Log Out' : 'Log In'}
                            </button>
                        )}

                        <div className="hidden md:block">
                            <LanguageSelector />
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-black/40 leading-none">User</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-black text-neutral-900 leading-none">{firstName || userEmail?.split('@')[0]}</span>
                                    {studentId && (
                                        <span className="text-[10px] font-semibold text-primary border border-primary px-1.5 py-0.5 rounded-sm leading-none">
                                            ID: {studentId}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <UserAvatar src={avatarUrl} firstName={firstName} email={userEmail} size="sm" isLoggedIn={isLoggedIn} />
                        </div>
                    </div>
                </div>
            </header >

            {/* Mobile Slide-out Menu - Moved outside header stacking context */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <UserAvatar src={avatarUrl} firstName={firstName} email={userEmail} size="md" isLoggedIn={isLoggedIn} />
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900">Menu</h3>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-1 text-neutral-400 hover:text-black transition-colors hidden"
                                >
                                    <X size={20} weight="regular" />
                                </button>
                            </div>
                        </div>
                        {userEmail && (
                            <div className="space-y-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-black/40 leading-none">Signed in as</span>
                                <p className="text-xs font-black text-neutral-900 leading-tight">{firstName || userEmail}</p>
                                {studentId && (
                                    <span className="inline-block text-[10px] font-semibold text-primary border border-primary px-1.5 py-0.5 rounded-sm mt-1">
                                        ID: {studentId}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <nav className="p-4 space-y-1">
                        {isLoggedIn && mobileNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-neutral-100 text-black'
                                        : 'text-black hover:bg-neutral-50 hover:opacity-70'
                                        }`}
                                >
                                    <Icon size={18} weight="regular" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-neutral-100">
                        <button
                            onClick={() => setExpandedMobileSections(prev => ({ ...prev, language: !prev.language }))}
                            className="w-full text-left px-6 py-4 text-sm font-bold uppercase flex items-center justify-between hover:bg-neutral-50"
                        >
                            Language
                            {expandedMobileSections.language ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                        </button>
                        {expandedMobileSections.language && (
                            <div className="animate-in slide-in-from-top-1 duration-200">
                                <LanguageSelector mobile />
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        {isAccountPage && (
                            <button
                                onClick={() => {
                                    if (isLoggedIn) {
                                        handleSignOut();
                                    } else {
                                        router.push('/portal/account/login');
                                    }
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition-colors"
                            >
                                <LogOut size={16} weight="regular" />
                                {isLoggedIn ? 'Log Out' : 'Log In'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
