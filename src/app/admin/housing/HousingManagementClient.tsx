'use client';

import React, { useState } from 'react';

import { PencilSimple as Edit2, Trash, House as Home, CheckCircle, Clock, XCircle, Buildings as Building2, Users, Bed, CurrencyEur as DollarSign, Plus, Check, X } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import { HousingBuilding, HousingRoom, HousingAssignment, HousingApplication, Semester } from '@/types/database';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface HousingManagementClientProps {
    applications: any[];
    availableRooms: any[];
    assignments: any[];
    buildings: any[];
    onRefresh: () => Promise<void>;
}

export default function HousingManagementClient({
    applications,
    availableRooms,
    assignments,
    buildings,
    onRefresh
}: HousingManagementClientProps) {
    const [selectedTab, setSelectedTab] = useState<'applications' | 'assignments' | 'buildings'>('applications');
    const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [newBuilding, setNewBuilding] = useState({ name: '', campus_location: '' });
    const [newRoom, setNewRoom] = useState({ building_id: '', room_number: '', capacity: 1, monthly_rate: 600 });

    // Editing State
    const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);
    const [editBuildingData, setEditBuildingData] = useState({ name: '', campus_location: '' });
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
    const [editRoomData, setEditRoomData] = useState({ room_number: '', capacity: 1, monthly_rate: 600 });

    // Filter for applications that need action (Pending OR Approved but not yet assigned)
    // Relaxed filter: Show all PENDING apps, and APPROVED apps that aren't assigned.
    const actionableApplications = applications.filter(app => {
        const isAssigned = assignments.some(a => a.application_id === app.id);
        if (app.status === 'PENDING') return !isAssigned;
        if (app.status === 'APPROVED') return !isAssigned;
        return false;
    });

    const pendingApplications = actionableApplications; // Maintain variable name for UI compatibility or rename if preferred
    const approvedApplications = applications.filter(app => app.status === 'APPROVED');
    const rejectedApplications = applications.filter(app => app.status === 'REJECTED');

    const stats = {
        totalApplications: applications.length,
        pending: pendingApplications.length,
        approved: approvedApplications.length,
        totalAssignments: assignments.length,
        availableRooms: availableRooms.length,
        totalBuildings: buildings.length
    };

    const handleAssignRoom = async (applicationId: string, roomId: string) => {
        setAssignLoading(true);
        setError('');
        try {
            const supabase = createClient();

            // 1. Get application details
            const { data: application, error: appError } = await supabase
                .from('housing_applications')
                .select('*')
                .eq('id', applicationId)
                .single();

            if (appError || !application) throw new Error(`Application not found: ${appError?.message}`);

            // 2. Get student info
            const { data: student, error: studentError } = await supabase
                .from('students')
                .select('id, user:profiles(email, first_name, last_name)') // Fetch profile for email/name if needed for invoice metadata
                .eq('id', application.student_id)
                .single();

            if (studentError || !student) throw new Error(`Student not found: ${studentError?.message}`);

            // 3. Check room availability
            const { data: room, error: roomError } = await supabase
                .from('housing_rooms')
                .select('*, building:housing_buildings(name)')
                .eq('id', roomId)
                .eq('status', 'AVAILABLE')
                .single();

            if (roomError || !room) throw new Error('Room not available');

            // 4. Create assignment
            const { error: assignmentError } = await supabase
                .from('housing_assignments')
                .insert({
                    application_id: applicationId,
                    room_id: roomId,
                    student_id: student.id,
                    start_date: application.move_in_date,
                    end_date: application.move_out_date,
                    status: 'ASSIGNED'
                });

            if (assignmentError) throw assignmentError;

            // 5. Generate Invoice
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14); // Due in 14 days by default
            const referenceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

            const { data: invoice, error: invoiceError } = await supabase
                .from('housing_invoices')
                .insert({
                    student_id: student.id,
                    application_id: applicationId,
                    reference_number: referenceNumber,
                    total_amount: room.monthly_rate,
                    paid_amount: 0,
                    currency: 'EUR', // Default currency
                    status: 'PENDING',
                    due_date: dueDate.toISOString(),
                    description: `Housing Rent - ${room.building?.name} Room ${room.room_number}`,
                    metadata: {
                        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
                        room_id: roomId
                    }
                })
                .select()
                .single();

            if (invoiceError) throw new Error(`Assignment created, but invoice failed: ${invoiceError.message}`);

            // 6. Create Invoice Item
            if (invoice) {
                const { error: itemError } = await supabase
                    .from('housing_invoice_items')
                    .insert({
                        invoice_id: invoice.id,
                        description: `Monthly Rent - Room ${room.room_number}`,
                        amount: room.monthly_rate,
                        quantity: 1,
                        item_type: 'MONTHLY_RENT'
                    });

                if (itemError) console.error("Failed to create invoice item:", itemError);
            }

            // 7. Update statuses
            await Promise.all([
                supabase.from('housing_applications').update({ status: 'APPROVED' }).eq('id', applicationId),
                supabase.from('housing_rooms').update({ status: 'OCCUPIED' }).eq('id', roomId)
            ]);

            setShowAssignModal(false);
            await onRefresh();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setAssignLoading(false);
        }
    };

    const handleDeleteApplication = async (id: string) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this housing application? This will also remove associated invoices and payment records.')) return;
        setAssignLoading(true);
        try {
            const supabase = createClient();

            // 1. Get associated invoices
            const { data: invoices } = await supabase.from('housing_invoices').select('id').eq('application_id', id);
            if (invoices && invoices.length > 0) {
                const ids = invoices.map(i => i.id);
                await supabase.from('housing_payments').delete().in('invoice_id', ids);
                await supabase.from('housing_invoice_items').delete().in('invoice_id', ids);
                await supabase.from('housing_invoices').delete().in('id', ids);
            }

            // 2. Free up room if assigned
            const { data: assignments } = await supabase.from('housing_assignments').select('room_id').eq('application_id', id);
            if (assignments && assignments.length > 0) {
                await supabase.from('housing_rooms').update({ status: 'AVAILABLE' }).in('id', assignments.map(a => a.room_id));
            }

            // 3. Delete related
            await supabase.from('housing_deposits').delete().eq('application_id', id);
            await supabase.from('housing_assignments').delete().eq('application_id', id);
            await supabase.from('housing_audit_logs').delete().eq('target_id', id);

            // 4. Delete application
            const { error } = await supabase.from('housing_applications').delete().eq('id', id);
            if (error) throw error;

            await onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this assignment? The room will become available again.')) return;
        console.log('Starting deletion for assignment:', id);
        setAssignLoading(true);
        try {
            const supabase = createClient();

            // 1. Get assignment details to identify room
            const { data: assignment, error: fetchError } = await supabase
                .from('housing_assignments')
                .select('room_id')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('Error fetching assignment before delete:', fetchError);
                // We typically continue to try to delete even if fetch fails, 
                // but if we can't find it, maybe it's already gone.
            }

            console.log('Found assignment to delete:', assignment);

            if (assignment?.room_id) {
                // 2. Free up the room
                const { error: roomError } = await supabase
                    .from('housing_rooms')
                    .update({ status: 'AVAILABLE' })
                    .eq('id', assignment.room_id);

                if (roomError) {
                    console.error('Failed to update room status:', roomError);
                    if (!window.confirm('Failed to update room status. Continue deleting assignment anyway?')) {
                        return;
                    }
                } else {
                    console.log('Room status updated to AVAILABLE');
                }
            }

            // 3. Delete the assignment
            const { error: deleteError } = await supabase
                .from('housing_assignments')
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('Delete failed:', deleteError);
                throw new Error(`Failed to delete assignment: ${deleteError.message} (Code: ${deleteError.code})`);
            }

            console.log('Assignment deleted successfully. Refreshing...');
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for propagation
            await onRefresh();
            console.log('Refresh complete.');
            alert('Assignment removed successfully.');

        } catch (err: any) {
            console.error('handleDeleteAssignment Exception:', err);
            alert(`Error removing assignment: ${err.message}`);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleDeleteRoom = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        setAssignLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.from('housing_rooms').delete().eq('id', id);
            if (error) throw error;
            await onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleDeleteBuilding = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this entire building? This will only work if the building has no rooms.')) return;
        setAssignLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.from('housing_buildings').delete().eq('id', id);
            if (error) throw error;
            await onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleUpdateBuilding = async (id: string) => {
        setAssignLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.from('housing_buildings').update(editBuildingData).eq('id', id);
            if (error) throw error;
            setEditingBuildingId(null);
            await onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleUpdateRoom = async (id: string) => {
        setAssignLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.from('housing_rooms').update(editRoomData).eq('id', id);
            if (error) throw error;
            setEditingRoomId(null);
            await onRefresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAssignLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Housing Management</h1>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Review Applications & Assign Rooms
                </p>
            </div>

            <div className="flex gap-3">
                <Link
                    href="/admin/housing/finance"
                    className="px-6 py-3 bg-neutral-100 border-2 border-black rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2"
                >
                    <DollarSign size={14} weight="bold" /> Finance Console
                </Link>
                <button
                    onClick={() => setShowAddBuildingModal(true)}
                    className="px-6 py-3 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                >
                    <Plus size={14} weight="bold" /> Add Building
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-white border-2 border-black p-4 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total Applications</p>
                    <p className="text-2xl font-black">{stats.totalApplications}</p>
                </div>
                <div className="bg-amber-50 border-2 border-amber-500 p-4 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Pending</p>
                    <p className="text-2xl font-black text-amber-700">{stats.pending}</p>
                </div>
                <div className="bg-green-50 border-2 border-green-500 p-4 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-green-600 mb-1">Approved</p>
                    <p className="text-2xl font-black text-green-700">{stats.approved}</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-blue-600 mb-1">Assignments</p>
                    <p className="text-2xl font-black text-blue-700">{stats.totalAssignments}</p>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Available Rooms</p>
                    <p className="text-2xl font-black">{stats.availableRooms}</p>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Buildings</p>
                    <p className="text-2xl font-black">{stats.totalBuildings}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-neutral-200">
                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedTab('applications')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedTab === 'applications'
                            ? 'text-black border-b-2 border-black -mb-0.5'
                            : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Applications ({pendingApplications.length})
                    </button>
                    <button
                        onClick={() => setSelectedTab('assignments')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedTab === 'assignments'
                            ? 'text-black border-b-2 border-black -mb-0.5'
                            : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Assignments ({assignments.length})
                    </button>
                    <button
                        onClick={() => setSelectedTab('buildings')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedTab === 'buildings'
                            ? 'text-black border-b-2 border-black -mb-0.5'
                            : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Buildings & Rooms ({buildings.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            {
                selectedTab === 'applications' ? (
                    <div className="space-y-4">
                        {pendingApplications.length === 0 ? (
                            <div className="bg-neutral-50 border-2 border-neutral-200 p-12 rounded-sm text-center">
                                <Clock size={48} weight="regular" className="mx-auto text-neutral-300 mb-4" />
                                <h3 className="text-xl font-black uppercase mb-2">No Applications Requiring Action</h3>
                                <p className="text-sm text-neutral-600">All applications are either pending payment or already assigned.</p>
                            </div>
                        ) : (
                            pendingApplications.map((app) => (
                                <div key={app.id} className="bg-white border-2 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black uppercase">
                                                {app.student?.user?.first_name} {app.student?.user?.last_name}
                                            </h3>
                                            <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">
                                                Student ID: {app.student?.user?.student_number || app.student?.student_id || 'N/A'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {app.status === 'APPROVED' ? 'Deposit Paid' : app.status}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Semester</p>
                                            <p className="font-bold">{app.semester?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Preferred Building</p>
                                            <p className="font-bold">{app.preferred_building?.name || 'No Preference'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Move-in Date</p>
                                            <p className="font-bold">{new Date(app.move_in_date).toISOString().split('T')[0]}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Move-out Date</p>
                                            <p className="font-bold">{new Date(app.move_out_date).toISOString().split('T')[0]}</p>
                                        </div>
                                    </div>

                                    {app.notes && (
                                        <div className="mb-4 p-3 bg-neutral-50 rounded-sm">
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Notes</p>
                                            <p className="text-sm">{app.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedApplication(app);
                                                setShowAssignModal(true);
                                            }}
                                            className="px-4 py-2 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                                        >
                                            <Bed size={14} weight="bold" /> Assign Room
                                        </button>
                                        <button
                                            onClick={() => handleDeleteApplication(app.id)}
                                            className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
                                        >
                                            <Trash size={14} weight="bold" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : selectedTab === 'assignments' ? (
                    <div className="space-y-4">
                        {assignments.length === 0 ? (
                            <div className="bg-neutral-50 border-2 border-neutral-200 p-12 rounded-sm text-center">
                                <Home size={48} weight="regular" className="mx-auto text-neutral-300 mb-4" />
                                <h3 className="text-xl font-black uppercase mb-2">No Room Assignments</h3>
                                <p className="text-sm text-neutral-600">No students have been assigned rooms yet.</p>
                            </div>
                        ) : (
                            assignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white border-2 border-green-500 p-6 rounded-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-black uppercase">
                                                {assignment.student?.user?.first_name} {assignment.student?.user?.last_name}
                                            </h3>
                                            <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">
                                                Student ID: {assignment.student?.user?.student_number || assignment.student?.student_id || 'N/A'}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[8px] font-black uppercase">
                                            {assignment.status}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                            title="Remove Assignment"
                                        >
                                            <XCircle size={20} weight="bold" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Building</p>
                                            <p className="font-bold">{assignment.room?.building?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Room Number</p>
                                            <p className="font-bold">{assignment.room?.room_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Duration</p>
                                            <p className="text-sm">{new Date(assignment.start_date).toISOString().split('T')[0]} - {new Date(assignment.end_date).toISOString().split('T')[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {buildings.map((building) => {
                            const buildingRooms = availableRooms.filter(r => r.building_id === building.id);
                            const buildingAssignments = assignments.filter(a => a.room?.building_id === building.id);
                            const totalRooms = 10; // Placeholder until we have room count from DB properly
                            const occupancyRate = totalRooms > 0 ? Math.round((buildingAssignments.length / totalRooms) * 100) : 0;

                            return (
                                <div key={building.id} className="bg-white border-2 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                    <div className="flex items-start justify-between mb-6">
                                        {editingBuildingId === building.id ? (
                                            <div className="flex-1 space-y-2 mr-4">
                                                <input
                                                    className="w-full px-2 py-1 text-sm border-2 border-black font-bold outline-none"
                                                    value={editBuildingData.name}
                                                    onChange={(e) => setEditBuildingData({ ...editBuildingData, name: e.target.value })}
                                                />
                                                <input
                                                    className="w-full px-2 py-1 text-[10px] border-2 border-neutral-200 font-bold outline-none"
                                                    value={editBuildingData.campus_location}
                                                    onChange={(e) => setEditBuildingData({ ...editBuildingData, campus_location: e.target.value })}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateBuilding(building.id)}
                                                        className="p-1 bg-black text-white rounded-sm hover:bg-neutral-800"
                                                    >
                                                        <Check size={14} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingBuildingId(null)}
                                                        className="p-1 border-2 border-neutral-200 rounded-sm hover:bg-neutral-100"
                                                    >
                                                        <X size={14} weight="bold" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tighter">{building.name}</h3>
                                                <p className="text-[10px] font-bold text-neutral-500 uppercase">{building.campus_location}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            {editingBuildingId !== building.id && (
                                                <button
                                                    onClick={() => {
                                                        setEditingBuildingId(building.id);
                                                        setEditBuildingData({ name: building.name, campus_location: building.campus_location });
                                                    }}
                                                    className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-sm transition-all"
                                                    title="Edit Building"
                                                >
                                                    <Edit2 size={20} weight="bold" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteBuilding(building.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                                title="Delete Building"
                                            >
                                                <Trash size={20} />
                                            </button>
                                            <Building2 className="text-neutral-400" size={24} weight="regular" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Occupancy</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-black transition-all"
                                                        style={{ width: `${occupancyRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold">{occupancyRate}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Avail. Rooms</p>
                                            <p className="text-lg font-black">{buildingRooms.length}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedBuilding(building)}
                                        className="w-full px-4 py-2 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                    >
                                        View Room Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

            {/* Room Details Modal */}
            {selectedBuilding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-black rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedBuilding.name}</h2>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{selectedBuilding.campus_location}</p>
                            </div>
                            <button
                                onClick={() => setSelectedBuilding(null)}
                                className="p-2 border-2 border-black hover:bg-neutral-100 transition-all"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="flex justify-between items-center mb-6 border-b-2 border-neutral-100 pb-4">
                            <h3 className="text-sm font-black uppercase">Room Inventory</h3>
                            <button
                                onClick={() => setShowAddRoomModal(true)}
                                className="px-4 py-2 bg-black text-white rounded-sm text-[8px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                            >
                                <Plus size={10} weight="bold" className="inline mr-1" /> Add Room
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableRooms.filter(r => r.building_id === selectedBuilding.id).map((room) => (
                                    <div key={room.id} className="p-4 border-2 border-green-200 bg-green-50 rounded-sm relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            {editingRoomId === room.id ? (
                                                <div className="space-y-2">
                                                    <input
                                                        className="w-20 px-1 py-0.5 text-sm border-2 border-black font-bold outline-none"
                                                        value={editRoomData.room_number}
                                                        onChange={(e) => setEditRoomData({ ...editRoomData, room_number: e.target.value })}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleUpdateRoom(room.id)} className="p-1 bg-black text-white rounded-sm"><Check size={10} weight="bold" /></button>
                                                        <button onClick={() => setEditingRoomId(null)} className="p-1 border border-neutral-300 rounded-sm"><X size={10} weight="bold" /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="font-black text-lg">#{room.room_number}</p>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingRoomId(room.id);
                                                                setEditRoomData({
                                                                    room_number: room.room_number,
                                                                    capacity: room.capacity,
                                                                    monthly_rate: room.monthly_rate
                                                                });
                                                            }}
                                                            className="p-1 text-neutral-400 hover:text-black transition-opacity"
                                                        >
                                                            <Edit2 size={12} weight="bold" />
                                                        </button>
                                                        <span className="text-[8px] font-black uppercase bg-green-200 text-green-700 px-2 py-0.5 rounded-full">Available</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-[10px] space-y-1">
                                            {editingRoomId === room.id ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="number"
                                                        className="px-1 py-0.5 border border-neutral-300 outline-none"
                                                        value={editRoomData.capacity}
                                                        onChange={(e) => setEditRoomData({ ...editRoomData, capacity: Number(e.target.value) })}
                                                        placeholder="Cap"
                                                    />
                                                    <input
                                                        type="number"
                                                        className="px-1 py-0.5 border border-neutral-300 outline-none"
                                                        value={editRoomData.monthly_rate}
                                                        onChange={(e) => setEditRoomData({ ...editRoomData, monthly_rate: Number(e.target.value) })}
                                                        placeholder="€"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="font-bold uppercase text-neutral-500">Capacity: {room.capacity}</p>
                                                    <p className="font-bold uppercase text-neutral-500">Rate: €{room.monthly_rate}/mo</p>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteRoom(room.id)}
                                            className="mt-3 w-full py-1 text-[8px] font-black uppercase text-red-600 border border-red-200 hover:bg-red-50 rounded-sm transition-all"
                                        >
                                            Delete Room
                                        </button>
                                    </div>
                                ))}
                                {assignments.filter(a => a.room?.building_id === selectedBuilding.id).map((assignment) => (
                                    <div key={assignment.id} className="p-4 border-2 border-neutral-200 bg-neutral-50 rounded-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-black text-lg">#{assignment.room?.room_number}</p>
                                            <span className="text-[8px] font-black uppercase bg-neutral-200 text-neutral-500 px-2 py-0.5 rounded-full">Occupied</span>
                                        </div>
                                        <div className="text-[10px] space-y-1">
                                            <p className="font-black text-black">OCCUPIED BY: {assignment.student?.user?.first_name} {assignment.student?.user?.last_name}</p>
                                            <p className="font-bold uppercase text-neutral-500">Until: {formatToDDMMYYYY(assignment.end_date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Room Modal */}
            {showAssignModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-black rounded-sm max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
                        <h2 className="text-xl font-black uppercase mb-6">
                            Assign Room to {selectedApplication.student?.user?.first_name} {selectedApplication.student?.user?.last_name}
                        </h2>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-sm mb-6">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <p className="text-sm">
                                <strong>Preferred Building:</strong> {selectedApplication.preferred_building?.name || 'No preference'}
                            </p>
                            <p className="text-sm">
                                <strong>Available Rooms:</strong> {availableRooms.length}
                            </p>
                        </div>

                        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                            {availableRooms.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => handleAssignRoom(selectedApplication.id, room.id)}
                                    disabled={assignLoading}
                                    className="w-full text-left p-4 border-2 border-neutral-200 rounded-sm hover:border-black transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-black">{room.building?.name} - Room {room.room_number}</p>
                                            <p className="text-sm text-neutral-600">{room.building?.campus_location}</p>
                                            <p className="text-xs text-neutral-500 mt-1">Capacity: {room.capacity} | €{room.monthly_rate}/month</p>
                                        </div>
                                        <Bed className="text-neutral-400" size={24} weight="regular" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setShowAssignModal(false);
                                setSelectedApplication(null);
                                setError('');
                            }}
                            className="w-full px-4 py-3 border-2 border-black rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add Building Modal */}
            {showAddBuildingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-6">Add New Building</h2>
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Building Name</label>
                                <input
                                    className="w-full px-4 py-2 border-2 border-black font-bold outline-none"
                                    value={newBuilding.name}
                                    onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                                    placeholder="e.g. North Hall"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Campus Location</label>
                                <input
                                    className="w-full px-4 py-2 border-2 border-black font-bold outline-none"
                                    value={newBuilding.campus_location}
                                    onChange={(e) => setNewBuilding({ ...newBuilding, campus_location: e.target.value })}
                                    placeholder="e.g. Helsinki Campus"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowAddBuildingModal(false)}
                                className="flex-1 py-3 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setAssignLoading(true);
                                    try {
                                        const supabase = createClient();
                                        const { error } = await supabase.from('housing_buildings').insert(newBuilding);
                                        if (error) throw error;
                                        setShowAddBuildingModal(false);
                                        window.location.reload();
                                    } catch (err: any) {
                                        alert(err.message);
                                    } finally {
                                        setAssignLoading(false);
                                    }
                                }}
                                disabled={assignLoading || !newBuilding.name || !newBuilding.campus_location}
                                className="flex-1 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                            >
                                {assignLoading ? 'Adding...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAddRoomModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-6">Add New Room</h2>
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Select Building</label>
                                <select
                                    className="w-full px-4 py-2 border-2 border-black font-bold outline-none bg-white"
                                    value={newRoom.building_id}
                                    onChange={(e) => setNewRoom({ ...newRoom, building_id: e.target.value })}
                                >
                                    <option value="">Choose Building...</option>
                                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Room Number</label>
                                <input
                                    className="w-full px-4 py-2 border-2 border-black font-bold outline-none"
                                    value={newRoom.room_number}
                                    onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                                    placeholder="e.g. 101"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border-2 border-black font-bold outline-none"
                                        value={newRoom.capacity}
                                        onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Rate (€/mo)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border-2 border-black font-bold outline-none"
                                        value={newRoom.monthly_rate}
                                        onChange={(e) => setNewRoom({ ...newRoom, monthly_rate: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowAddRoomModal(false)}
                                className="flex-1 py-3 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setAssignLoading(true);
                                    try {
                                        const supabase = createClient();
                                        const { error } = await supabase.from('housing_rooms').insert({
                                            ...newRoom,
                                            amenities: []
                                        });
                                        if (error) throw error;
                                        setShowAddRoomModal(false);
                                        window.location.reload();
                                    } catch (err: any) {
                                        alert(err.message);
                                    } finally {
                                        setAssignLoading(false);
                                    }
                                }}
                                disabled={assignLoading || !newRoom.building_id || !newRoom.room_number}
                                className="flex-1 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                            >
                                {assignLoading ? 'Adding...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
