'use client';

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import HousingManagementClient from './HousingManagementClient';
import { useState, useEffect } from 'react';

export default function AdminHousingPage() {
    const [data, setData] = useState<{
        applications: any[];
        availableRooms: any[];
        assignments: any[];
        buildings: any[];
    }>({
        applications: [],
        availableRooms: [],
        assignments: [],
        buildings: []
    });
    const [loading, setLoading] = useState(true);

    const fetchHousingData = async () => {
        setLoading(true);
        const supabase = createClient();
        try {
            // Fetch all housing applications with student info (joined)
            const { data: apps } = await supabase
                .from('housing_applications')
                .select('*, student:students(*, user:profiles(*)), semester:semesters(name), preferred_building:housing_buildings(name, campus_location)')
                .order('created_at', { ascending: false });

            console.log('Fetched Housing Apps:', apps);

            // Fetch all available rooms with building info
            const { data: rooms } = await supabase
                .from('housing_rooms')
                .select('*, building:housing_buildings(*)')
                .eq('status', 'AVAILABLE')
                .order('building_id');

            // Fetch all housing assignments with complete data
            const { data: assign, error: assignError } = await supabase
                .from('housing_assignments')
                .select(`
                    *,
                    student:students(*, user:profiles(*)),
                    room:housing_rooms(
                        *,
                        building:housing_buildings(*)
                    )
                `)
                .order('created_at', { ascending: false });

            console.log('Fetched Housing Assignments:', assign);

            if (assignError) console.error("Error fetching assignments:", assignError);

            // Fetch all buildings for stats
            const { data: bldgs } = await supabase
                .from('housing_buildings')
                .select('*')
                .order('name');

            setData({
                applications: apps || [],
                availableRooms: rooms || [],
                assignments: assign || [],
                buildings: bldgs || []
            });
        } catch (error) {
            console.error("Error fetching housing data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHousingData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 p-4 md:p-8 font-sans animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Admin Dashboard
                    </Link>
                </div>

                <HousingManagementClient
                    applications={data.applications}
                    availableRooms={data.availableRooms}
                    assignments={data.assignments}
                    buildings={data.buildings}
                    onRefresh={fetchHousingData}
                />
            </div>
            );</div>
    );
}
