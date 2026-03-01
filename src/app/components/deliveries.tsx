import { Sidebar } from './sidebar';
import { useState } from 'react';

type DeliveryStatus = 'pending' | 'assigned' | 'out_for_delivery' | 'delivered' | 'failed';

interface Delivery {
    id: string;
    orderId: string;
    customer: string;
    address: string;
    phone: string;
    status: DeliveryStatus;
    assignedTo?: string;
    scheduledDate: string;
    deliveredAt?: string;
    amount: number;
    items: number;
    notes?: string;
}

interface DeliveryPerson {
    id: string;
    name: string;
    phone: string;
    status: 'available' | 'on_route' | 'offline';
    activeDeliveries: number;
}

export function Deliveries() {
    const [filterStatus, setFilterStatus] = useState<DeliveryStatus | 'all'>('all');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [deliveryPersons] = useState<DeliveryPerson[]>([
        { id: 'DRV-001', name: 'Raju Kumar', phone: '+91 99887 76655', status: 'available', activeDeliveries: 0 },
        { id: 'DRV-002', name: 'Suresh Yadav', phone: '+91 88776 65544', status: 'on_route', activeDeliveries: 2 },
        { id: 'DRV-003', name: 'Mohan Singh', phone: '+91 77665 54433', status: 'available', activeDeliveries: 1 },
    ]);

    const [deliveries, setDeliveries] = useState<Delivery[]>([
        { id: 'DEL-001', orderId: 'ORD-0421', customer: 'Park Street Store', address: '12 Park Street, Kolkata 700016', phone: '+91 98765 43210', status: 'pending', scheduledDate: '28 Dec', amount: 684.40, items: 3 },
        { id: 'DEL-002', orderId: 'ORD-0420', customer: 'Raja Market', address: '45 Raja Bazar, Kolkata 700006', phone: '+91 87654 32109', status: 'assigned', assignedTo: 'Suresh Yadav', scheduledDate: '28 Dec', amount: 1463.20, items: 7 },
        { id: 'DEL-003', orderId: 'ORD-0419', customer: 'Quick Mart', address: '78 Quick Lane, Kolkata 700001', phone: '+91 76543 21098', status: 'out_for_delivery', assignedTo: 'Suresh Yadav', scheduledDate: '28 Dec', amount: 413, items: 2 },
        { id: 'DEL-004', orderId: 'ORD-0418', customer: 'City Supplies', address: '23 City Center, Kolkata 700071', phone: '+91 65432 10987', status: 'delivered', assignedTo: 'Mohan Singh', scheduledDate: '27 Dec', deliveredAt: '27 Dec 4:30 PM', amount: 1050.20, items: 5 },
        { id: 'DEL-005', orderId: 'ORD-0417', customer: 'Metro Store', address: '56 Metro Plaza, Kolkata 700091', phone: '+91 54321 09876', status: 'delivered', assignedTo: 'Raju Kumar', scheduledDate: '26 Dec', deliveredAt: '26 Dec 2:15 PM', amount: 790.60, items: 4 },
        { id: 'DEL-006', orderId: 'ORD-0416', customer: 'Central Bazaar', address: '89 Central Road, Kolkata 700012', phone: '+91 43210 98765', status: 'failed', assignedTo: 'Raju Kumar', scheduledDate: '25 Dec', amount: 1239, items: 6, notes: 'Shop was closed' },
    ]);

    const filteredDeliveries = deliveries.filter(d => filterStatus === 'all' || d.status === filterStatus);

    const stats = {
        pending: deliveries.filter(d => d.status === 'pending').length,
        assigned: deliveries.filter(d => d.status === 'assigned').length,
        outForDelivery: deliveries.filter(d => d.status === 'out_for_delivery').length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
        failed: deliveries.filter(d => d.status === 'failed').length,
    };

    const getStatusBadge = (status: DeliveryStatus) => {
        const styles: Record<DeliveryStatus, string> = {
            pending: 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30 dark:text-zinc-400',
            assigned: 'bg-blue-500/20 text-blue-600 border-blue-500/30 dark:text-blue-400',
            out_for_delivery: 'bg-purple-500/20 text-purple-600 border-purple-500/30 dark:text-purple-400',
            delivered: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
            failed: 'bg-red-500/20 text-red-600 border-red-500/30 dark:text-red-400',
        };
        const labels: Record<DeliveryStatus, string> = {
            pending: 'Pending',
            assigned: 'Assigned',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
            failed: 'Failed',
        };
        return <span className={`px-2 py-1 text-xs border ${styles[status]}`}>{labels[status]}</span>;
    };

    const getDriverStatusBadge = (status: DeliveryPerson['status']) => {
        const styles = {
            available: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
            on_route: 'bg-purple-500/20 text-purple-600 border-purple-500/30 dark:text-purple-400',
            offline: 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30 dark:text-zinc-400',
        };
        const labels = { available: 'Available', on_route: 'On Route', offline: 'Offline' };
        return <span className={`px-2 py-1 text-xs border ${styles[status]}`}>{labels[status]}</span>;
    };

    const handleAssign = (driverId: string, driverName: string) => {
        if (!selectedDelivery) return;

        setDeliveries(deliveries.map(d =>
            d.id === selectedDelivery.id
                ? { ...d, status: 'assigned' as DeliveryStatus, assignedTo: driverName }
                : d
        ));
        setShowAssignModal(false);
        setSelectedDelivery(null);
    };

    const handleStatusUpdate = (deliveryId: string, newStatus: DeliveryStatus) => {
        setDeliveries(deliveries.map(d => {
            if (d.id !== deliveryId) return d;

            const updates: Partial<Delivery> = { status: newStatus };
            if (newStatus === 'delivered') {
                updates.deliveredAt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            }

            return { ...d, ...updates };
        }));
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl mb-2">Deliveries</h1>
                        <p className="text-muted-foreground">Track and manage order deliveries</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-5 gap-6 mb-12">
                        <button
                            onClick={() => setFilterStatus('pending')}
                            className={`p-6 border transition-colors text-left bg-card ${filterStatus === 'pending' ? 'border-primary' : 'border-border hover:border-foreground/20'}`}
                        >
                            <div className="text-muted-foreground text-sm mb-2">Pending</div>
                            <div className="text-3xl tabular-nums">{stats.pending}</div>
                        </button>
                        <button
                            onClick={() => setFilterStatus('assigned')}
                            className={`p-6 border transition-colors text-left bg-card ${filterStatus === 'assigned' ? 'border-blue-500' : 'border-border hover:border-foreground/20'}`}
                        >
                            <div className="text-muted-foreground text-sm mb-2">Assigned</div>
                            <div className="text-3xl tabular-nums text-blue-500">{stats.assigned}</div>
                        </button>
                        <button
                            onClick={() => setFilterStatus('out_for_delivery')}
                            className={`p-6 border transition-colors text-left bg-card ${filterStatus === 'out_for_delivery' ? 'border-purple-500' : 'border-border hover:border-foreground/20'}`}
                        >
                            <div className="text-muted-foreground text-sm mb-2">Out for Delivery</div>
                            <div className="text-3xl tabular-nums text-purple-500">{stats.outForDelivery}</div>
                        </button>
                        <button
                            onClick={() => setFilterStatus('delivered')}
                            className={`p-6 border transition-colors text-left bg-card ${filterStatus === 'delivered' ? 'border-emerald-500' : 'border-border hover:border-foreground/20'}`}
                        >
                            <div className="text-muted-foreground text-sm mb-2">Delivered</div>
                            <div className="text-3xl tabular-nums text-emerald-500">{stats.delivered}</div>
                        </button>
                        <button
                            onClick={() => setFilterStatus('failed')}
                            className={`p-6 border transition-colors text-left bg-card ${filterStatus === 'failed' ? 'border-red-500' : 'border-border hover:border-foreground/20'}`}
                        >
                            <div className="text-muted-foreground text-sm mb-2">Failed</div>
                            <div className="text-3xl tabular-nums text-red-500">{stats.failed}</div>
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 border transition-colors ${filterStatus === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                            >
                                All
                            </button>
                        </div>
                        <div className="text-muted-foreground">
                            {filteredDeliveries.length} deliveries
                        </div>
                    </div>

                    {/* Deliveries Table */}
                    <div className="border border-border bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left p-4 text-muted-foreground font-medium">Order</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Address</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Assigned To</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeliveries.map((delivery) => (
                                    <tr key={delivery.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="tabular-nums">{delivery.orderId}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{delivery.items} items • ₹{delivery.amount.toLocaleString('en-IN')}</div>
                                        </td>
                                        <td className="p-4">
                                            <div>{delivery.customer}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{delivery.phone}</div>
                                        </td>
                                        <td className="p-4 text-muted-foreground max-w-xs truncate">{delivery.address}</td>
                                        <td className="p-4">
                                            {delivery.assignedTo ? (
                                                <span className="text-foreground">{delivery.assignedTo}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="p-4">{getStatusBadge(delivery.status)}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedDelivery(delivery);
                                                    setShowDetailModal(true);
                                                }}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                View
                                            </button>
                                            {delivery.status === 'pending' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-400 transition-colors"
                                                >
                                                    Assign
                                                </button>
                                            )}
                                            {delivery.status === 'assigned' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(delivery.id, 'out_for_delivery')}
                                                    className="text-purple-500 hover:text-purple-400 transition-colors"
                                                >
                                                    Start Delivery
                                                </button>
                                            )}
                                            {delivery.status === 'out_for_delivery' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                                                    className="text-emerald-500 hover:text-emerald-400 transition-colors"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredDeliveries.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No deliveries found for this status.
                        </div>
                    )}

                    {/* Delivery Persons Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl mb-6">Delivery Team</h2>
                        <div className="grid grid-cols-3 gap-6">
                            {deliveryPersons.map((person) => (
                                <div key={person.id} className="p-6 border border-border bg-card">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="font-medium">{person.name}</div>
                                            <div className="text-sm text-muted-foreground mt-1">{person.phone}</div>
                                        </div>
                                        {getDriverStatusBadge(person.status)}
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Active Deliveries</span>
                                        <span className="tabular-nums">{person.activeDeliveries}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Modal */}
            {showAssignModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-md shadow-xl">
                        <h2 className="text-2xl mb-6">Assign Delivery</h2>

                        <div className="p-4 bg-muted/20 border border-border mb-6">
                            <div className="font-medium">{selectedDelivery.orderId}</div>
                            <div className="text-muted-foreground text-sm mt-1">{selectedDelivery.customer}</div>
                            <div className="text-muted-foreground text-sm mt-1">{selectedDelivery.address}</div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm text-muted-foreground mb-2">Select Delivery Person</div>
                            {deliveryPersons.filter(p => p.status !== 'offline').map((person) => (
                                <button
                                    key={person.id}
                                    onClick={() => handleConfirmAssign(person.id, person.name)}
                                    className="w-full p-4 border border-border hover:border-foreground/50 transition-colors text-left flex justify-between items-center bg-card hover:bg-muted/50"
                                >
                                    <div>
                                        <div>{person.name}</div>
                                        <div className="text-sm text-muted-foreground">{person.activeDeliveries} active deliveries</div>
                                    </div>
                                    {getDriverStatusBadge(person.status)}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedDelivery(null);
                                }}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-lg shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl">Delivery Details</h2>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedDelivery(null);
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-muted-foreground text-sm">Order</div>
                                    <div className="text-lg tabular-nums">{selectedDelivery.orderId}</div>
                                </div>
                                {getStatusBadge(selectedDelivery.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/20 border border-border">
                                    <div className="text-muted-foreground text-sm mb-1">Customer</div>
                                    <div>{selectedDelivery.customer}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{selectedDelivery.phone}</div>
                                </div>
                                <div className="p-4 bg-muted/20 border border-border">
                                    <div className="text-muted-foreground text-sm mb-1">Order Value</div>
                                    <div className="text-lg tabular-nums">₹{selectedDelivery.amount.toLocaleString('en-IN')}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{selectedDelivery.items} items</div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/20 border border-border">
                                <div className="text-muted-foreground text-sm mb-1">Delivery Address</div>
                                <div>{selectedDelivery.address}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/20 border border-border">
                                    <div className="text-muted-foreground text-sm mb-1">Scheduled</div>
                                    <div>{selectedDelivery.scheduledDate}</div>
                                </div>
                                <div className="p-4 bg-muted/20 border border-border">
                                    <div className="text-muted-foreground text-sm mb-1">Assigned To</div>
                                    <div>{selectedDelivery.assignedTo || '—'}</div>
                                </div>
                            </div>

                            {selectedDelivery.deliveredAt && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30">
                                    <div className="text-emerald-500 text-sm mb-1">Delivered At</div>
                                    <div className="text-emerald-500">{selectedDelivery.deliveredAt}</div>
                                </div>
                            )}

                            {selectedDelivery.notes && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30">
                                    <div className="text-red-500 text-sm mb-1">Notes</div>
                                    <div className="text-red-500">{selectedDelivery.notes}</div>
                                </div>
                            )}
                        </div>

                        {/* Status Actions */}
                        <div className="flex gap-4 mt-8">
                            {selectedDelivery.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        setShowAssignModal(true);
                                    }}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                                >
                                    Assign Driver
                                </button>
                            )}
                            {selectedDelivery.status === 'assigned' && (
                                <button
                                    onClick={() => {
                                        handleStatusUpdate(selectedDelivery.id, 'out_for_delivery');
                                        setShowDetailModal(false);
                                        setSelectedDelivery(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                                >
                                    Start Delivery
                                </button>
                            )}
                            {selectedDelivery.status === 'out_for_delivery' && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedDelivery.id, 'delivered');
                                            setShowDetailModal(false);
                                            setSelectedDelivery(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                                    >
                                        Mark Delivered
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedDelivery.id, 'failed');
                                            setShowDetailModal(false);
                                            setSelectedDelivery(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white hover:bg-red-500 transition-colors"
                                    >
                                        Mark Failed
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function handleConfirmAssign(driverId: string, driverName: string) {
        handleAssign(driverId, driverName);
    }
}
