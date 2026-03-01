import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useExpenses } from '../../hooks/useExpenses';

export function Dashboard() {
  const { orders, loading: ordersLoading } = useOrders();
  const { stats: expenseStats } = useExpenses();

  // Compute stats from real orders data
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const invoiced = orders.filter(o => o.status === 'invoiced').length;
    const thisMonthRevenue = orders
      .filter(o => {
        const orderDate = new Date(o.created_at);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return { total, pending, invoiced, thisMonthRevenue };
  }, [orders]);

  // Get last 5 orders for display
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      completed: 'text-emerald-500',
      invoiced: 'text-blue-400',
      pending: 'text-amber-400',
    };
    const statusKey = (status || 'pending').toLowerCase();
    return <span className={`text-sm ${styles[statusKey] || 'text-muted-foreground'}`}>{status || 'Pending'}</span>;
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Recent orders and overview</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Total Orders</div>
              <div className="text-3xl tabular-nums">{stats.total}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Pending</div>
              <div className="text-3xl tabular-nums text-amber-400">{stats.pending}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Invoiced</div>
              <div className="text-3xl tabular-nums">{stats.invoiced}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">This Month</div>
              <div className="text-3xl tabular-nums">₹{stats.thisMonthRevenue.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Expense Summary */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Total Expenses</div>
              <div className="text-3xl tabular-nums text-red-400">₹{expenseStats.total.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Net Revenue (This Month)</div>
              <div className="text-3xl tabular-nums text-emerald-400">
                ₹{(stats.thisMonthRevenue - expenseStats.total).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Recent Orders</h2>
              <Link
                to="/new-order"
                className="px-6 py-2 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium"
              >
                New Order
              </Link>
            </div>

            <div className="border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">Order ID</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Items</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No orders yet. Create your first order to get started.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4 tabular-nums text-sm">{order.id.slice(0, 8)}</td>
                        <td className="p-4">{order.customers?.name || '-'}</td>
                        <td className="p-4 text-right tabular-nums">{order.order_items?.length || 0}</td>
                        <td className="p-4 text-right tabular-nums">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                        <td className="p-4">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
