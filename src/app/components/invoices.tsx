import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'upi' | 'bank' | 'other';
  note?: string;
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  customer: string;
  amount: number;
  amountPaid: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  payments: Payment[];
}

export function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('upi');
  const [paymentNote, setPaymentNote] = useState('');

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-0421',
      date: '28 Dec',
      dueDate: '11 Jan',
      customer: 'Park Street Store',
      amount: 684.40,
      amountPaid: 684.40,
      status: 'paid',
      payments: [{ id: 'PAY-001', date: '28 Dec', amount: 684.40, method: 'upi' }]
    },
    {
      id: 'INV-0420',
      date: '27 Dec',
      dueDate: '10 Jan',
      customer: 'Raja Market',
      amount: 1463.20,
      amountPaid: 500,
      status: 'partial',
      payments: [{ id: 'PAY-002', date: '27 Dec', amount: 500, method: 'cash', note: 'Partial advance' }]
    },
    {
      id: 'INV-0419',
      date: '26 Dec',
      dueDate: '09 Jan',
      customer: 'City Supplies',
      amount: 1050.20,
      amountPaid: 1050.20,
      status: 'paid',
      payments: [{ id: 'PAY-003', date: '26 Dec', amount: 1050.20, method: 'bank' }]
    },
    {
      id: 'INV-0418',
      date: '26 Dec',
      dueDate: '09 Jan',
      customer: 'Metro Store',
      amount: 790.60,
      amountPaid: 0,
      status: 'unpaid',
      payments: []
    },
    {
      id: 'INV-0417',
      date: '15 Dec',
      dueDate: '22 Dec',
      customer: 'Central Bazaar',
      amount: 1239.00,
      amountPaid: 0,
      status: 'overdue',
      payments: []
    },
  ]);

  const getStatusBadge = (status: Invoice['status']) => {
    const styles = {
      paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      partial: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      unpaid: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels = {
      paid: 'Paid',
      partial: 'Partial',
      unpaid: 'Unpaid',
      overdue: 'Overdue',
    };
    return (
      <span className={`px-2 py-1 text-xs border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleRecordPayment = () => {
    if (!selectedInvoice || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    const newAmountPaid = selectedInvoice.amountPaid + amount;
    const newStatus: Invoice['status'] =
      newAmountPaid >= selectedInvoice.amount ? 'paid' : 'partial';

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      amount,
      method: paymentMethod,
      note: paymentNote || undefined,
    };

    setInvoices(invoices.map(inv =>
      inv.id === selectedInvoice.id
        ? {
          ...inv,
          amountPaid: newAmountPaid,
          status: newStatus,
          payments: [...inv.payments, newPayment]
        }
        : inv
    ));

    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setPaymentAmount('');
    setPaymentNote('');
  };

  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + (inv.amount - inv.amountPaid), 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">Invoices</h1>
            <p className="text-muted-foreground">Track invoices and payment status</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Total Invoiced</div>
              <div className="text-3xl tabular-nums">₹{invoices.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN')}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Received</div>
              <div className="text-3xl tabular-nums text-emerald-500">₹{totalPaid.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Pending</div>
              <div className="text-3xl tabular-nums text-amber-500">₹{totalPending.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-6 border border-border bg-card">
              <div className="text-muted-foreground text-sm mb-2">Overdue</div>
              <div className="text-3xl tabular-nums text-red-500">{overdueCount}</div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-muted-foreground font-medium">Invoice #</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Due Date</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Paid</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 tabular-nums">{invoice.id}</td>
                    <td className="p-4">{invoice.date}</td>
                    <td className={`p-4 ${invoice.status === 'overdue' ? 'text-red-500' : ''}`}>
                      {invoice.dueDate}
                    </td>
                    <td className="p-4">{invoice.customer}</td>
                    <td className="p-4 text-right tabular-nums">₹{invoice.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right tabular-nums">
                      <span className={invoice.amountPaid > 0 ? 'text-emerald-500' : 'text-muted-foreground'}>
                        ₹{invoice.amountPaid.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link to="/invoice-preview" className="text-muted-foreground hover:text-foreground transition-colors">
                        View
                      </Link>
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowPaymentModal(true);
                            setPaymentAmount((invoice.amount - invoice.amountPaid).toFixed(2));
                          }}
                          className="text-emerald-500 hover:text-emerald-400 transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl mb-6">Record Payment</h2>

            <div className="mb-6 p-4 bg-muted/20 border border-border">
              <div className="text-muted-foreground text-sm">Invoice {selectedInvoice.id}</div>
              <div className="text-lg">{selectedInvoice.customer}</div>
              <div className="text-muted-foreground mt-2">
                Remaining: <span className="text-amber-500 tabular-nums">
                  ₹{(selectedInvoice.amount - selectedInvoice.amountPaid).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Payment['method'])}
                  className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                >
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Note (optional)</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                  placeholder="e.g., Partial payment"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedInvoice(null);
                }}
                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
