import { Sidebar } from './sidebar';
import { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';

type Period = 'week' | 'month' | 'quarter';

export function Analytics() {
    const [period, setPeriod] = useState<Period>('month');

    // Revenue data for different periods
    const revenueData = {
        week: [
            { name: 'Mon', revenue: 4200, orders: 8 },
            { name: 'Tue', revenue: 5800, orders: 12 },
            { name: 'Wed', revenue: 3900, orders: 7 },
            { name: 'Thu', revenue: 6200, orders: 14 },
            { name: 'Fri', revenue: 7100, orders: 15 },
            { name: 'Sat', revenue: 8500, orders: 18 },
            { name: 'Sun', revenue: 4100, orders: 9 },
        ],
        month: [
            { name: 'Week 1', revenue: 28500, orders: 52 },
            { name: 'Week 2', revenue: 32100, orders: 61 },
            { name: 'Week 3', revenue: 29800, orders: 55 },
            { name: 'Week 4', revenue: 45890, orders: 83 },
        ],
        quarter: [
            { name: 'Oct', revenue: 98500, orders: 185 },
            { name: 'Nov', revenue: 112400, orders: 210 },
            { name: 'Dec', revenue: 136290, orders: 251 },
        ],
    };

    // Payment status data
    const paymentData = [
        { name: 'Paid', value: 45890, color: '#10b981' },
        { name: 'Partial', value: 8640, color: '#f59e0b' },
        { name: 'Unpaid', value: 12340, color: '#6b7280' },
        { name: 'Overdue', value: 4230, color: '#ef4444' },
    ];

    // Top customers
    const topCustomers = [
        { name: 'City Supplies', orders: 32, revenue: 28700, growth: 15 },
        { name: 'Park Street Store', orders: 24, revenue: 18500, growth: 8 },
        { name: 'Raja Market', orders: 18, revenue: 12400, growth: -3 },
        { name: 'Quick Mart', orders: 12, revenue: 8900, growth: 22 },
        { name: 'Metro Store', orders: 8, revenue: 5200, growth: 5 },
    ];

    // Recent activity
    const recentActivity = [
        { type: 'payment', description: 'Payment received from Park Street Store', amount: 684.40, time: '2 hours ago' },
        { type: 'invoice', description: 'Invoice INV-0421 created', amount: 684.40, time: '3 hours ago' },
        { type: 'order', description: 'New order from Raja Market', amount: 1463.20, time: '5 hours ago' },
        { type: 'customer', description: 'Central Bazaar added as customer', amount: null, time: '1 day ago' },
        { type: 'payment', description: 'Payment received from City Supplies', amount: 1050.20, time: '2 days ago' },
    ];

    // Category sales
    const categoryData = [
        { name: 'Rice & Grains', value: 35 },
        { name: 'Sugar & Spices', value: 22 },
        { name: 'Oils', value: 18 },
        { name: 'Pulses', value: 15 },
        { name: 'Others', value: 10 },
    ];

    const currentData = revenueData[period];
    const totalRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = currentData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    const pendingAmount = paymentData.slice(1).reduce((sum, d) => sum + d.value, 0);

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border p-3 shadow-lg">
                    <p className="text-muted-foreground text-sm">{label}</p>
                    <p className="text-foreground font-medium tabular-nums">
                        ₹{payload[0].value.toLocaleString('en-IN')}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12">
                    {/* Header */}
                    <div className="mb-12 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl mb-2">Analytics</h1>
                            <p className="text-muted-foreground">Track your business performance</p>
                        </div>
                        <div className="flex border border-border bg-card">
                            {(['week', 'month', 'quarter'] as Period[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 transition-colors ${period === p
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'Quarter'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Total Revenue</div>
                            <div className="text-3xl tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</div>
                            <div className="text-emerald-500 text-sm mt-2">+12% ↑</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Total Orders</div>
                            <div className="text-3xl tabular-nums">{totalOrders}</div>
                            <div className="text-emerald-500 text-sm mt-2">+8% ↑</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Avg. Order Value</div>
                            <div className="text-3xl tabular-nums">₹{avgOrderValue.toFixed(0)}</div>
                            <div className="text-emerald-500 text-sm mt-2">+5% ↑</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Pending Payments</div>
                            <div className="text-3xl tabular-nums text-amber-500">₹{pendingAmount.toLocaleString('en-IN')}</div>
                            <div className="text-muted-foreground text-sm mt-2">3 invoices</div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-3 gap-6 mb-12">
                        {/* Revenue Chart */}
                        <div className="col-span-2 border border-border bg-card p-6">
                            <h3 className="text-xl mb-6">Revenue Over Time</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={currentData}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={{ stroke: 'hsl(var(--border))' }}
                                        />
                                        <YAxis
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={{ stroke: 'hsl(var(--border))' }}
                                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fill="url(#revenueGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="border border-border bg-card p-6">
                            <h3 className="text-xl mb-6">Payment Status</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {paymentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {paymentData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-muted-foreground">{item.name}</span>
                                        <span className="text-sm tabular-nums ml-auto">
                                            ₹{(item.value / 1000).toFixed(1)}K
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Top Customers */}
                        <div className="border border-border bg-card p-6">
                            <h3 className="text-xl mb-6">Top Customers</h3>
                            <div className="space-y-4">
                                {topCustomers.map((customer, index) => (
                                    <div key={customer.name} className="flex items-center gap-4">
                                        <div className="w-6 text-muted-foreground text-sm">{index + 1}</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{customer.name}</div>
                                            <div className="text-xs text-muted-foreground">{customer.orders} orders</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="tabular-nums">₹{customer.revenue.toLocaleString('en-IN')}</div>
                                            <div className={`text-xs ${customer.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {customer.growth >= 0 ? '+' : ''}{customer.growth}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category Sales */}
                        <div className="border border-border bg-card p-6">
                            <h3 className="text-xl mb-6">Sales by Category</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={11}
                                            tickLine={false}
                                            width={80}
                                        />
                                        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="border border-border bg-card p-6">
                            <h3 className="text-xl mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full ${activity.type === 'payment' ? 'bg-emerald-500' :
                                            activity.type === 'invoice' ? 'bg-blue-500' :
                                                activity.type === 'order' ? 'bg-purple-500' :
                                                    'bg-amber-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm truncate">{activity.description}</div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                                                {activity.amount && (
                                                    <span className="text-xs tabular-nums text-muted-foreground">
                                                        ₹{activity.amount.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
