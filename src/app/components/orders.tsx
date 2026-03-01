import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useOrders } from '../../hooks/useOrders';

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Supabase hook
  const { orders, loading, error } = useOrders();

  // Find the selected order for the modal
  const selectedOrderData = useMemo(() => {
    return orders.find(o => o.id === selectedOrder) || null;
  }, [orders, selectedOrder]);

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      invoiced: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
    const statusKey = (status || 'pending').toLowerCase();
    return (
      <span className={`px-2 py-1 text-xs border ${styles[statusKey] || styles.pending}`}>
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-4xl mb-2">Orders</h1>
              <p className="text-muted-foreground">All orders from WhatsApp</p>
            </div>
            <Link
              to="/new-order"
              className="px-6 py-2 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-opacity"
            >
              New Order
            </Link>
          </div>

          {/* Orders Table */}
          <div className="border border-border rounded-sm bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Items</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 tabular-nums text-sm">{order.id.slice(0, 8)}</td>
                    <td className="p-4">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td className="p-4">{order.customers?.name || '-'}</td>
                    <td className="p-4 text-right tabular-nums">{order.order_items?.length || 0}</td>
                    <td className="p-4 text-right tabular-nums">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        View
                      </button>
                      {order.status === 'pending' && (
                        <Link
                          to="/review-order"
                          className="text-emerald-500 hover:text-emerald-400 transition-colors"
                        >
                          Review
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border p-8 w-full max-w-2xl max-h-[80vh] overflow-auto shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl">Order</h2>
                <div className="text-muted-foreground mt-1 text-sm">{new Date(selectedOrderData.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-muted/20 border border-border">
                <div className="text-muted-foreground text-sm mb-1">Customer</div>
                <div className="font-medium">{selectedOrderData.customers?.name || '-'}</div>
                <div className="text-sm text-muted-foreground mt-1">{selectedOrderData.customers?.phone || '-'}</div>
              </div>
              <div className="p-4 bg-muted/20 border border-border">
                <div className="text-muted-foreground text-sm mb-1">Notes</div>
                <div className="text-sm">{selectedOrderData.address || '-'}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg mb-4">Order Items</h3>
              <div className="border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left p-3 text-muted-foreground text-sm font-medium">Product ID</th>
                      <th className="text-right p-3 text-muted-foreground text-sm font-medium">Qty</th>
                      <th className="text-right p-3 text-muted-foreground text-sm font-medium">Price</th>
                      <th className="text-right p-3 text-muted-foreground text-sm font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrderData.order_items || []).map((item, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="p-3 text-sm">{item.product_id?.slice(0, 8) || '-'}</td>
                        <td className="p-3 text-right tabular-nums">{item.quantity}</td>
                        <td className="p-3 text-right tabular-nums">₹{item.price?.toLocaleString('en-IN') || 0}</td>
                        <td className="p-3 text-right tabular-nums">₹{((item.quantity || 0) * (item.price || 0)).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border border-border p-4 mb-8 bg-muted/10">
              <div className="flex justify-between py-2 text-lg">
                <span>Total</span>
                <span className="tabular-nums font-medium">₹{(selectedOrderData.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Status:</span>
                {getStatusBadge(selectedOrderData.status)}
              </div>
              <div className="flex gap-3">
                {selectedOrderData.status === 'pending' && (
                  <Link
                    to="/review-order"
                    className="px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Review Order
                  </Link>
                )}
                {selectedOrderData.status === 'pending' && (
                  <Link
                    to="/create-invoice"
                    className="px-6 py-2 border border-border text-muted-foreground hover:border-foreground/50 transition-colors"
                  >
                    Create Invoice
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
