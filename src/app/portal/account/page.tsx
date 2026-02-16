'use client';

import { createClient } from '@/utils/supabase/client';
import { User, Envelope as Mail, Globe, Calendar, GraduationCap, Clock, ShieldCheck, CircleNotch as Loader2 } from "@phosphor-icons/react";
import Link from 'next/link';
import { formatToDDMMYYYY } from '@/utils/date';
import AvatarUpload from '@/components/portal/AvatarUpload';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser) {
                    router.push('/portal/account/login');
                    return;
                }

                setUser(authUser);

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .maybeSingle();

                if (profileError || !profileData) {
                    router.push('/portal/account/login');
                    return;
                }

                setProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile:', error);
                router.push('/portal/account/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [supabase, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (!user || !profile) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-[#2d2d2d]">Student Profile</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2d2d2d]">Account Details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Account Details */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-white p-6 border border-neutral-200">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2d2d2d] border-b border-neutral-100 pb-2 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileItem label="Email Address" value={user.email} />
                            <ProfileItem label="Date of Birth" value={profile.date_of_birth} />
                            <ProfileItem label="Country" value={profile.country_of_residence} />
                            <ProfileItem label="Joined" value={formatToDDMMYYYY(profile.created_at)} />
                        </div>
                    </div>

                    <div className="bg-neutral-900 p-6 text-white">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">Account Security</h3>
                        <p className="text-[10px] font-bold leading-relaxed mb-4 uppercase tracking-tight text-white/90">
                            Your account is protected by Sykli College biometric-ready authentication.
                        </p>
                        <button className="text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-all">
                            Request Data Update
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="md:col-span-4 space-y-4">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 text-center">
                        <AvatarUpload
                            userId={user.id}
                            currentAvatarUrl={profile.avatar_url}
                            firstName={profile.first_name}
                            email={user.email}
                        />
                        <h2 className="text-sm font-black uppercase tracking-tight text-[#2d2d2d]">
                            {profile.first_name} {profile.last_name}
                        </h2>

                        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-1 items-center">
                            <div className="text-[9px] font-black uppercase tracking-widest leading-none text-[#2d2d2d]">Student ID</div>
                            <div className="text-base font-black leading-none text-[#2d2d2d]">{profile.student_id || 'N/A'}</div>
                        </div>
                    </div>

                    <Link
                        href="/portal/dashboard"
                        className="flex items-center justify-center w-full py-3 bg-neutral-100 rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ label, value }: { label: string, value?: string }) {
    return (
        <div className="space-y-0.5">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#2d2d2d]">{label}</div>
            <div className="text-xs font-bold leading-tight text-[#2d2d2d]">{value || 'N/A'}</div>
        </div>
    );
}
