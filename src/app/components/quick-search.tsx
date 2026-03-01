import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';

// Mock data for search
const searchData = [
    // Pages
    { type: 'Page', id: 'dashboard', title: 'Dashboard', path: '/dashboard' },
    { type: 'Page', id: 'new-order', title: 'New Order', path: '/new-order' },
    { type: 'Page', id: 'orders', title: 'Orders', path: '/orders' },
    { type: 'Page', id: 'deliveries', title: 'Deliveries', path: '/deliveries' },
    { type: 'Page', id: 'invoices', title: 'Invoices', path: '/invoices' },
    { type: 'Page', id: 'customers', title: 'Customers', path: '/customers' },
    { type: 'Page', id: 'products', title: 'Products', path: '/products' },
    { type: 'Page', id: 'expenses', title: 'Expenses', path: '/expenses' },
    { type: 'Page', id: 'team', title: 'Team', path: '/team' },
    { type: 'Page', id: 'analytics', title: 'Analytics', path: '/analytics' },
    { type: 'Page', id: 'settings', title: 'Settings', path: '/settings' },

    // Products
    { type: 'Product', id: 'prd-001', title: 'Basmati Rice (5kg)', path: '/products' },
    { type: 'Product', id: 'prd-002', title: 'Sugar (1kg)', path: '/products' },
    { type: 'Product', id: 'prd-003', title: 'Sunflower Oil (1L)', path: '/products' },

    // Customers
    { type: 'Customer', id: 'cust-001', title: 'Park Street Store', path: '/customers' },
    { type: 'Customer', id: 'cust-002', title: 'Raja Market', path: '/customers' },
    { type: 'Customer', id: 'cust-003', title: 'Quick Mart', path: '/customers' },

    // Orders
    { type: 'Order', id: 'ord-0421', title: 'ORD-0421 - Park Street Store', path: '/orders' },
    { type: 'Order', id: 'ord-0420', title: 'ORD-0420 - Raja Market', path: '/orders' },
];

export function QuickSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    const filteredResults = query
        ? searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) // Limit to 5 results
        : [];

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredResults[selectedIndex]) {
                navigate(filteredResults[selectedIndex].path);
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="w-full max-w-lg relative bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-border px-4">
                    <svg className="w-5 h-5 text-muted-foreground mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 py-4 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-lg"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="text-xs text-muted-foreground border border-border px-2 py-1 rounded hidden sm:block">
                        ESC
                    </div>
                </div>

                {filteredResults.length > 0 && (
                    <div className="py-2 max-h-[60vh] overflow-y-auto">
                        <div className="px-4 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Results
                        </div>
                        {filteredResults.map((result, index) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${index === selectedIndex ? 'bg-muted/20 text-foreground' : 'text-muted-foreground hover:bg-muted/10'
                                    }`}
                                onClick={() => {
                                    navigate(result.path);
                                    onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${result.type === 'Page' ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' :
                                            result.type === 'Product' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                result.type === 'Customer' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        }`}>
                                        {result.type}
                                    </span>
                                    <span>{result.title}</span>
                                </div>
                                {index === selectedIndex && (
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {query && filteredResults.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No results found for "{query}"
                    </div>
                )}

                {!query && (
                    <div className="p-4 bg-muted/5 text-xs text-muted-foreground border-t border-border flex justify-between">
                        <div className="flex gap-4">
                            <span>Navigate with arrows</span>
                            <span>Enter to select</span>
                        </div>
                        <span>Slate Search</span>
                    </div>
                )}
            </div>
        </div>
    );
}
