import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function CreateInvoice() {
  const [items] = useState([
    { id: 1, description: 'Rice (bags)', quantity: 5, price: 100, amount: 500 },
    { id: 2, description: 'Sugar', quantity: 2, price: 40, amount: 80 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">Create Invoice</h1>
            <p className="text-muted-foreground">Professional invoice editor</p>
          </div>

          {/* Invoice Container */}
          <div className="max-w-4xl mx-auto border border-border p-12 bg-card">
            {/* Business Details */}
            <div className="grid grid-cols-2 gap-12 mb-12 pb-8 border-b border-border">
              <div>
                <div className="text-sm text-muted-foreground mb-2">FROM</div>
                <input
                  type="text"
                  defaultValue="Demo Business Ltd."
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors mb-1"
                />
                <input
                  type="text"
                  defaultValue="123 Business Street"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors text-sm text-muted-foreground mb-1"
                />
                <input
                  type="text"
                  defaultValue="Mumbai 400001"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors text-sm text-muted-foreground mb-1"
                />
                <input
                  type="text"
                  defaultValue="GSTIN: 27XXXXX1234X1Z5"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors text-sm text-muted-foreground"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">TO</div>
                <input
                  type="text"
                  defaultValue="Park Street Store"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors mb-1"
                />
                <input
                  type="text"
                  defaultValue="Park Street"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors text-sm text-muted-foreground mb-1"
                />
                <input
                  type="text"
                  defaultValue="Mumbai 400001"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors text-sm text-muted-foreground"
                />
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Invoice #</div>
                <input
                  type="text"
                  defaultValue="INV-0421"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors tabular-nums"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Date</div>
                <input
                  type="text"
                  defaultValue="28 Dec 2025"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Due Date</div>
                <input
                  type="text"
                  defaultValue="11 Jan 2026"
                  className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-ring transition-colors"
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-sm text-muted-foreground font-medium">Description</th>
                    <th className="text-right pb-3 text-sm text-muted-foreground font-medium">Qty</th>
                    <th className="text-right pb-3 text-sm text-muted-foreground font-medium">Price</th>
                    <th className="text-right pb-3 text-sm text-muted-foreground font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right tabular-nums">{item.quantity}</td>
                      <td className="py-3 text-right tabular-nums">₹{item.price}</td>
                      <td className="py-3 text-right tabular-nums">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span className="tabular-nums">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="tabular-nums">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-8 text-sm text-muted-foreground">
              <div className="mb-2">Payment Details</div>
              <div className="mb-1">Bank: HDFC Bank</div>
              <div className="mb-1">Account: 1234567890</div>
              <div className="mb-4">IFSC: HDFC0001234</div>
              <div className="text-xs">Thank you for your business.</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 max-w-4xl mx-auto">
            <Link
              to="/invoice-preview"
              className="px-8 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium"
            >
              Preview & Download
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3 text-muted-foreground border border-border hover:border-foreground transition-colors"
            >
              Save as Draft
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
