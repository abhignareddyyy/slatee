import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function ReviewOrder() {
  const [orderData, setOrderData] = useState([
    { id: 1, item: 'Rice (bags)', quantity: '5', price: '₹100', address: 'Park Street', notes: '', needsReview: false },
    { id: 2, item: 'Sugar', quantity: '2kg', price: '₹40', address: '', notes: '', needsReview: true },
  ]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">Review & Fix</h1>
            <p className="text-muted-foreground">Verify extracted data and make corrections</p>
          </div>

          {/* Customer Info */}
          <div className="mb-8 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Customer Name</label>
              <input
                type="text"
                defaultValue="Park Street Store"
                className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Contact</label>
              <input
                type="text"
                defaultValue="+91 98765 43210"
                className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
              />
            </div>
          </div>

          {/* Order Items Table */}
          <div className="mb-8">
            <div className="border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">Item</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Quantity</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Price</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Address</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-0">
                      <td className="p-2">
                        <input
                          type="text"
                          defaultValue={row.item}
                          className={`w-full px-4 py-2 bg-transparent border focus:outline-none transition-colors ${row.needsReview
                              ? 'border-destructive/30 bg-destructive/10'
                              : 'border-transparent hover:border-border'
                            }`}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          defaultValue={row.quantity}
                          className={`w-full px-4 py-2 bg-transparent border text-right tabular-nums focus:outline-none transition-colors ${row.needsReview
                              ? 'border-destructive/30 bg-destructive/10'
                              : 'border-transparent hover:border-border'
                            }`}
                        />
                        {row.needsReview && (
                          <div className="text-xs text-muted-foreground mt-1 px-4">Needs Review</div>
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          defaultValue={row.price}
                          className="w-full px-4 py-2 bg-transparent border border-transparent hover:border-border focus:outline-none text-right tabular-nums transition-colors"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          defaultValue={row.address}
                          placeholder={row.needsReview ? 'Add address' : ''}
                          className={`w-full px-4 py-2 bg-transparent border focus:outline-none transition-colors ${row.needsReview
                              ? 'border-destructive/30 bg-destructive/10'
                              : 'border-transparent hover:border-border'
                            }`}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          defaultValue={row.notes}
                          placeholder="Optional"
                          className="w-full px-4 py-2 bg-transparent border border-transparent hover:border-border focus:outline-none transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="mt-4 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
              + Add Item
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              to="/create-invoice"
              className="px-8 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium"
            >
              Generate Invoice
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3 text-muted-foreground border border-border hover:border-foreground transition-colors"
            >
              Confirm Order
            </Link>
            <button className="px-8 py-3 text-muted-foreground border border-border hover:border-foreground transition-colors ml-auto">
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
