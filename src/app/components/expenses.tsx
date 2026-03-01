import { Sidebar } from './sidebar';
import { useState } from 'react';
import { useExpenses, useAddExpense } from '../../hooks/useExpenses';

const categories = ['Rent', 'Utilities', 'Salaries', 'Inventory', 'Marketing', 'Maintenance', 'Other'];
const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Card'];

export function Expenses() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');

    // Use Supabase hooks
    const { expenses, stats, loading, error } = useExpenses();
    const { addExpense, loading: addingExpense } = useAddExpense();

    const [newExpense, setNewExpense] = useState({
        description: '',
        category: 'Other',
        amount: '',
        paymentMethod: 'Cash',
        notes: ''
    });

    const filteredExpenses = expenses.filter(e => filterCategory === 'All' || e.category === filterCategory);

    const handleAddExpense = async () => {
        if (!newExpense.description || !newExpense.amount) return;

        await addExpense({
            description: newExpense.description,
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            payment_method: newExpense.paymentMethod,
            notes: newExpense.notes || null,
            date: new Date().toISOString().split('T')[0],
        });

        setShowAddModal(false);
        setNewExpense({ description: '', category: 'Other', amount: '', paymentMethod: 'Cash', notes: '' });
    };

    return (
        <div className="flex h-screen bg-background text-foreground transition-colors">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12">
                    {/* Header */}
                    <div className="mb-12 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl mb-2">Expenses</h1>
                            <p className="text-muted-foreground">Track business costs and overheads</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-primary text-primary-foreground border border-border hover:opacity-90 transition-opacity"
                        >
                            Add Expense
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Total Expenses</div>
                            <div className="text-3xl tabular-nums">₹{stats.total.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Expense Count</div>
                            <div className="text-3xl tabular-nums">{stats.count}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Average Amount</div>
                            <div className="text-3xl tabular-nums">₹{Math.round(stats.average).toLocaleString('en-IN')}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Largest Expense</div>
                            <div className="text-3xl tabular-nums text-red-400">₹{stats.largest.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterCategory('All')}
                                className={`px-4 py-2 border transition-colors ${filterCategory === 'All' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-gray-500'}`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 border transition-colors ${filterCategory === cat ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-gray-500'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expenses Table */}
                    <div className="border border-border bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Description</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Category</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Method</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Amount</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                                        <td className="p-4 tabular-nums">{expense.date}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{expense.description}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{expense.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 text-xs border border-border bg-muted/50 text-muted-foreground rounded-full">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{expense.payment_method}</td>
                                        <td className="p-4 text-right tabular-nums font-medium">₹{expense.amount.toLocaleString('en-IN')}</td>
                                        <td className="p-4 text-right">
                                            <span className="text-muted-foreground text-sm">—</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-md shadow-lg">
                        <h2 className="text-2xl mb-6 font-medium">Add Expense</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Description *</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-primary transition-colors"
                                    placeholder="e.g., Shop Rent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Amount (₹) *</label>
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-primary transition-colors tabular-nums"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Category</label>
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-primary transition-colors"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Payment Method</label>
                                    <select
                                        value={newExpense.paymentMethod}
                                        onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-primary transition-colors"
                                    >
                                        {paymentMethods.map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Notes (Optional)</label>
                                <textarea
                                    value={newExpense.notes}
                                    onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-primary transition-colors resize-none h-24"
                                    placeholder="Additional details..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddExpense}
                                disabled={!newExpense.description || !newExpense.amount}
                                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
