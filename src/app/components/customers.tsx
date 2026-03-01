import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useCustomers, useAddCustomer } from '../../hooks/useCustomers';
import type { Customer as SupabaseCustomer } from '../../lib/types';

export function Customers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<SupabaseCustomer | null>(null);

    // Supabase hooks
    const { customers, loading, error } = useCustomers();
    const { addCustomer, loading: addingCustomer } = useAddCustomer();

    // New customer form state
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        tags: [] as string[],
    });

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (customer.phone || '').includes(searchQuery);
            const matchesTag = filterTag === 'all' || (customer.tags || []).includes(filterTag);
            return matchesSearch && matchesTag;
        });
    }, [customers, searchQuery, filterTag]);

    const stats = useMemo(() => ({
        total: customers.length,
        vip: customers.filter(c => (c.tags || []).includes('VIP')).length,
        regular: customers.filter(c => (c.tags || []).includes('Regular')).length,
        new: customers.filter(c => (c.tags || []).includes('New')).length,
        totalOutstanding: 0, // This would need a separate query for orders
    }), [customers]);

    const getTagBadge = (tag: string) => {
        const styles: Record<string, string> = {
            VIP: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            Regular: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            New: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
        return (
            <span key={tag} className={`px-2 py-0.5 text-xs border ${styles[tag] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}`}>
                {tag}
            </span>
        );
    };

    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.phone) return;

        await addCustomer({
            name: newCustomer.name,
            phone: newCustomer.phone,
            email: newCustomer.email || null,
            address: newCustomer.address || null,
            tags: newCustomer.tags.length > 0 ? newCustomer.tags : ['New'],
        });

        setShowAddModal(false);
        setNewCustomer({ name: '', phone: '', email: '', address: '', tags: [] });
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12">
                    {/* Header */}
                    <div className="mb-12 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl mb-2">Customers</h1>
                            <p className="text-muted-foreground">Manage your customer relationships</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-opacity"
                        >
                            Add Customer
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-5 gap-6 mb-12">
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Total Customers</div>
                            <div className="text-3xl tabular-nums">{stats.total}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">VIP</div>
                            <div className="text-3xl tabular-nums text-purple-400">{stats.vip}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Regular</div>
                            <div className="text-3xl tabular-nums text-blue-400">{stats.regular}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">New</div>
                            <div className="text-3xl tabular-nums text-emerald-400">{stats.new}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Outstanding</div>
                            <div className="text-3xl tabular-nums text-amber-500">₹{stats.totalOutstanding.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search customers by name or phone..."
                                className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                            />
                        </div>
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                        >
                            <option value="all">All Customers</option>
                            <option value="VIP">VIP</option>
                            <option value="Regular">Regular</option>
                            <option value="New">New</option>
                        </select>
                    </div>

                    {/* Customers Table */}
                    <div className="border border-border bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Phone</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Tags</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Address</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Since</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium">{customer.name}</div>
                                            {customer.email && (
                                                <div className="text-xs text-muted-foreground mt-1">{customer.email}</div>
                                            )}
                                        </td>
                                        <td className="p-4 tabular-nums">{customer.phone}</td>
                                        <td className="p-4">
                                            <div className="flex gap-1">
                                                {(customer.tags || []).map(tag => getTagBadge(tag))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground truncate max-w-xs">{customer.address || '-'}</td>
                                        <td className="p-4 text-muted-foreground text-sm">{new Date(customer.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                onClick={() => setSelectedCustomer(customer)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                View
                                            </button>
                                            <Link
                                                to="/new-order"
                                                className="text-emerald-500 hover:text-emerald-400 transition-colors"
                                            >
                                                New Order
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No customers found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-lg shadow-xl">
                        <h2 className="text-2xl mb-6">Add Customer</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    placeholder="Business or customer name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    placeholder="customer@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Address</label>
                                <textarea
                                    value={newCustomer.address}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors resize-none"
                                    placeholder="Delivery address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Tags</label>
                                <div className="flex gap-2">
                                    {['VIP', 'Regular', 'New'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => {
                                                const tags = newCustomer.tags.includes(tag)
                                                    ? newCustomer.tags.filter(t => t !== tag)
                                                    : [...newCustomer.tags, tag];
                                                setNewCustomer({ ...newCustomer, tags });
                                            }}
                                            className={`px-3 py-1.5 border transition-colors ${newCustomer.tags.includes(tag)
                                                ? 'border-foreground/20 bg-secondary text-secondary-foreground'
                                                : 'border-border text-muted-foreground hover:border-foreground/50'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewCustomer({ name: '', phone: '', email: '', address: '', tags: [] });
                                }}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCustomer}
                                disabled={!newCustomer.name || !newCustomer.phone}
                                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-2xl max-h-[80vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl">{selectedCustomer.name}</h2>
                                <div className="flex gap-2 mt-2">
                                    {(selectedCustomer.tags || []).map(tag => getTagBadge(tag))}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-4 bg-muted/20 border border-border">
                                <div className="text-muted-foreground text-sm mb-1">Phone</div>
                                <div className="tabular-nums">{selectedCustomer.phone}</div>
                            </div>
                            <div className="p-4 bg-muted/20 border border-border">
                                <div className="text-muted-foreground text-sm mb-1">Email</div>
                                <div>{selectedCustomer.email || '-'}</div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/20 border border-border mb-8">
                            <div className="text-muted-foreground text-sm mb-1">Address</div>
                            <div>{selectedCustomer.address || '-'}</div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 border border-border text-center">
                                <div className="text-2xl tabular-nums">{new Date(selectedCustomer.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                                <div className="text-muted-foreground text-sm mt-1">Customer Since</div>
                            </div>
                            <div className="p-4 border border-border text-center">
                                <div className="text-2xl tabular-nums">-</div>
                                <div className="text-muted-foreground text-sm mt-1">Total Orders</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Link
                                to="/new-order"
                                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-center"
                            >
                                Create Order
                            </Link>
                            <button className="flex-1 px-6 py-3 border border-border text-muted-foreground hover:border-foreground/50 transition-colors">
                                Edit Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
