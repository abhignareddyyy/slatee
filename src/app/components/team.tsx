import { Sidebar } from './sidebar';
import { useState } from 'react';

type Role = 'admin' | 'manager' | 'staff';
type MemberStatus = 'active' | 'pending' | 'inactive';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: MemberStatus;
    lastActive: string;
    avatar?: string;
}

interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    target: string;
    timestamp: string;
}

const rolePermissions = {
    admin: ['View Orders', 'Create Orders', 'View Invoices', 'Create Invoices', 'View Customers', 'Manage Customers', 'View Analytics', 'View Products', 'Manage Products', 'Manage Team', 'Settings'],
    manager: ['View Orders', 'Create Orders', 'View Invoices', 'Create Invoices', 'View Customers', 'Manage Customers', 'View Analytics', 'View Products', 'Manage Products'],
    staff: ['View Orders', 'Create Orders', 'View Invoices', 'View Customers', 'View Products'],
};

export function Team() {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [activeTab, setActiveTab] = useState<'members' | 'activity'>('members');

    const [members, setMembers] = useState<TeamMember[]>([
        { id: 'USR-001', name: 'Rahul Sharma', email: 'rahul@demo.app', role: 'admin', status: 'active', lastActive: 'Now' },
        { id: 'USR-002', name: 'Priya Patel', email: 'priya@demo.app', role: 'manager', status: 'active', lastActive: '2 hours ago' },
        { id: 'USR-003', name: 'Amit Kumar', email: 'amit@demo.app', role: 'staff', status: 'active', lastActive: '1 day ago' },
        { id: 'USR-004', name: 'Sneha Gupta', email: 'sneha@demo.app', role: 'staff', status: 'pending', lastActive: 'Never' },
    ]);

    const [activityLog] = useState<ActivityLog[]>([
        { id: 'LOG-001', userId: 'USR-001', userName: 'Rahul Sharma', action: 'Created invoice', target: 'INV-0421', timestamp: '2 hours ago' },
        { id: 'LOG-002', userId: 'USR-002', userName: 'Priya Patel', action: 'Added customer', target: 'Central Bazaar', timestamp: '3 hours ago' },
        { id: 'LOG-003', userId: 'USR-001', userName: 'Rahul Sharma', action: 'Updated product stock', target: 'Basmati Rice (+20)', timestamp: '5 hours ago' },
        { id: 'LOG-004', userId: 'USR-003', userName: 'Amit Kumar', action: 'Created order', target: 'ORD-0421', timestamp: '6 hours ago' },
        { id: 'LOG-005', userId: 'USR-002', userName: 'Priya Patel', action: 'Recorded payment', target: '₹684.40 from Park Street Store', timestamp: '1 day ago' },
        { id: 'LOG-006', userId: 'USR-001', userName: 'Rahul Sharma', action: 'Invited team member', target: 'sneha@demo.app', timestamp: '2 days ago' },
        { id: 'LOG-007', userId: 'USR-003', userName: 'Amit Kumar', action: 'Marked delivery complete', target: 'ORD-0418', timestamp: '2 days ago' },
        { id: 'LOG-008', userId: 'USR-002', userName: 'Priya Patel', action: 'Created invoice', target: 'INV-0420', timestamp: '3 days ago' },
    ]);

    const [inviteForm, setInviteForm] = useState({ email: '', role: 'staff' as Role });

    const getRoleBadge = (role: Role) => {
        const styles = {
            admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            staff: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        };
        const labels = { admin: 'Admin', manager: 'Manager', staff: 'Staff' };
        return <span className={`px-2 py-1 text-xs border ${styles[role]}`}>{labels[role]}</span>;
    };

    const getStatusBadge = (status: MemberStatus) => {
        const styles = {
            active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        const labels = { active: 'Active', pending: 'Pending', inactive: 'Inactive' };
        return <span className={`px-2 py-1 text-xs border ${styles[status]}`}>{labels[status]}</span>;
    };

    const handleInvite = () => {
        if (!inviteForm.email) return;

        const newMember: TeamMember = {
            id: `USR-${String(members.length + 1).padStart(3, '0')}`,
            name: inviteForm.email.split('@')[0],
            email: inviteForm.email,
            role: inviteForm.role,
            status: 'pending',
            lastActive: 'Never',
        };

        setMembers([...members, newMember]);
        setShowInviteModal(false);
        setInviteForm({ email: '', role: 'staff' });
    };

    const handleUpdateRole = (memberId: string, newRole: Role) => {
        setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    const handleToggleStatus = (memberId: string) => {
        setMembers(members.map(m => {
            if (m.id !== memberId) return m;
            const newStatus: MemberStatus = m.status === 'active' ? 'inactive' : 'active';
            return { ...m, status: newStatus };
        }));
    };

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'active').length,
        pending: members.filter(m => m.status === 'pending').length,
        admins: members.filter(m => m.role === 'admin').length,
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12">
                    {/* Header */}
                    <div className="mb-12 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl mb-2">Team</h1>
                            <p className="text-muted-foreground">Manage team members and permissions</p>
                        </div>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="px-6 py-2 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-opacity"
                        >
                            Invite Member
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Total Members</div>
                            <div className="text-3xl tabular-nums">{stats.total}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Active</div>
                            <div className="text-3xl tabular-nums text-emerald-500">{stats.active}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Pending Invites</div>
                            <div className="text-3xl tabular-nums text-amber-500">{stats.pending}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Admins</div>
                            <div className="text-3xl tabular-nums text-purple-400">{stats.admins}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-border">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`pb-4 px-2 transition-colors ${activeTab === 'members' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Members
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`pb-4 px-2 transition-colors ${activeTab === 'activity' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Activity Log
                        </button>
                    </div>

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="border border-border bg-card">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="text-left p-4 text-muted-foreground font-medium">Member</th>
                                        <th className="text-left p-4 text-muted-foreground font-medium">Role</th>
                                        <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                                        <th className="text-left p-4 text-muted-foreground font-medium">Last Active</th>
                                        <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{member.name}</div>
                                                        <div className="text-sm text-muted-foreground">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">{getRoleBadge(member.role)}</td>
                                            <td className="p-4">{getStatusBadge(member.status)}</td>
                                            <td className="p-4 text-muted-foreground">{member.lastActive}</td>
                                            <td className="p-4 text-right space-x-3">
                                                <button
                                                    onClick={() => setSelectedMember(member)}
                                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                {member.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleToggleStatus(member.id)}
                                                        className={`${member.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-emerald-500 hover:text-emerald-400'} transition-colors`}
                                                    >
                                                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === 'activity' && (
                        <div className="border border-border bg-card">
                            <div className="divide-y divide-border">
                                {activityLog.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm flex-shrink-0">
                                                {log.userName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex-1">
                                                <div>
                                                    <span className="font-medium">{log.userName}</span>
                                                    <span className="text-muted-foreground"> {log.action} </span>
                                                    <span className="text-muted-foreground">{log.target}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">{log.timestamp}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-md shadow-xl">
                        <h2 className="text-2xl mb-6">Invite Team Member</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    placeholder="colleague@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['admin', 'manager', 'staff'] as Role[]).map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => setInviteForm({ ...inviteForm, role })}
                                            className={`px-4 py-3 border transition-colors capitalize ${inviteForm.role === role
                                                ? 'border-primary bg-secondary text-primary-foreground'
                                                : 'border-border text-muted-foreground hover:border-foreground/50'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-muted/20 border border-border">
                                <div className="text-sm text-muted-foreground mb-2">Permissions:</div>
                                <div className="flex flex-wrap gap-2">
                                    {rolePermissions[inviteForm.role].map((perm) => (
                                        <span key={perm} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground">
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowInviteModal(false);
                                    setInviteForm({ email: '', role: 'staff' });
                                }}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInvite}
                                disabled={!inviteForm.email}
                                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-md shadow-xl">
                        <h2 className="text-2xl mb-6">Edit Member</h2>

                        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/20 border border-border">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                {selectedMember.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div className="font-medium">{selectedMember.name}</div>
                                <div className="text-sm text-muted-foreground">{selectedMember.email}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['admin', 'manager', 'staff'] as Role[]).map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => handleUpdateRole(selectedMember.id, role)}
                                            className={`px-4 py-3 border transition-colors capitalize ${selectedMember.role === role
                                                ? 'border-primary bg-secondary text-foreground'
                                                : 'border-border text-muted-foreground hover:border-foreground/50'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-muted/20 border border-border">
                                <div className="text-sm text-muted-foreground mb-2">Current Permissions:</div>
                                <div className="flex flex-wrap gap-2">
                                    {rolePermissions[selectedMember.role].map((perm) => (
                                        <span key={perm} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground">
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
