import { Sidebar } from './sidebar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

type InvoiceTheme = 'dark' | 'light' | 'minimal' | 'professional';

const themes: { id: InvoiceTheme; name: string; description: string }[] = [
  { id: 'dark', name: 'Dark', description: 'Dark background, modern look' },
  { id: 'light', name: 'Light', description: 'Clean white background' },
  { id: 'minimal', name: 'Minimal', description: 'Stripped down essentials' },
  { id: 'professional', name: 'Professional', description: 'Formal blue accents' },
];

export function InvoicePreview() {
  const [theme, setTheme] = useState<InvoiceTheme>('dark');
  const [showQR, setShowQR] = useState(true);

  const items = [
    { description: 'Rice (bags)', quantity: 5, price: 100, amount: 500 },
    { description: 'Sugar', quantity: 2, price: 40, amount: 80 },
  ];

  const subtotal = 580;
  const tax = 104.40;
  const total = 684.40;

  // Theme styles
  const themeStyles = {
    dark: {
      bg: 'bg-[#0a0a0a]',
      border: 'border-[#2a2a2a]',
      text: 'text-[#e0e0e0]',
      textSecondary: 'text-[#9a9a9a]',
      textMuted: 'text-[#6a6a6a]',
      accent: 'text-[#e0e0e0]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      accent: 'text-gray-900',
    },
    minimal: {
      bg: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-800',
      textSecondary: 'text-gray-500',
      textMuted: 'text-gray-400',
      accent: 'text-gray-800',
    },
    professional: {
      bg: 'bg-white',
      border: 'border-blue-100',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-blue-400',
      accent: 'text-blue-600',
    },
  };

  const s = themeStyles[theme];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl mb-2">Invoice Preview</h1>
              <p className="text-muted-foreground">Final invoice ready for delivery</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium">
                Download PDF
              </button>
              <button className="px-6 py-2 text-muted-foreground border border-border hover:border-foreground transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="mb-8 flex items-center gap-6">
            <span className="text-muted-foreground">Theme:</span>
            <div className="flex gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-4 py-2 border transition-colors ${theme === t.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-muted-foreground">Show UPI QR:</span>
              <button
                onClick={() => setShowQR(!showQR)}
                className={`w-12 h-6 rounded-full transition-colors ${showQR ? 'bg-emerald-500' : 'bg-input'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${showQR ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Invoice Document */}
          <div className={`max-w-4xl mx-auto ${s.bg} border ${s.border} p-16 transition-colors`}>
            {/* Header */}
            <div className={`grid grid-cols-2 gap-12 mb-16 pb-12 border-b ${s.border}`}>
              <div>
                <div className={`text-xl mb-8 tracking-tight ${s.text}`}>Demo Business Ltd.</div>
                <div className={`text-sm ${s.textSecondary} space-y-1`}>
                  <div>123 Business Street</div>
                  <div>Mumbai 400001</div>
                  <div>GSTIN: 27XXXXX1234X1Z5</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl mb-4 tabular-nums tracking-tight ${s.accent}`}>
                  {theme === 'professional' && <span className="text-lg font-normal mr-2">INVOICE</span>}
                  INV-0421
                </div>
                <div className={`text-sm ${s.textSecondary} space-y-1`}>
                  <div>Date: 28 Dec 2025</div>
                  <div>Due: 11 Jan 2026</div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-16">
              <div className={`text-xs ${s.textMuted} mb-3`}>BILL TO</div>
              <div className={`text-lg ${s.text}`}>Park Street Store</div>
              <div className={`text-sm ${s.textSecondary} mt-2 space-y-1`}>
                <div>Park Street</div>
                <div>Mumbai 400001</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-16">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${s.border}`}>
                    <th className={`text-left pb-4 text-xs ${s.textMuted} font-medium`}>DESCRIPTION</th>
                    <th className={`text-right pb-4 text-xs ${s.textMuted} font-medium`}>QTY</th>
                    <th className={`text-right pb-4 text-xs ${s.textMuted} font-medium`}>PRICE</th>
                    <th className={`text-right pb-4 text-xs ${s.textMuted} font-medium`}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className={`border-b ${s.border}`}>
                      <td className={`py-4 ${s.textSecondary}`}>{item.description}</td>
                      <td className={`py-4 text-right tabular-nums ${s.textSecondary}`}>{item.quantity}</td>
                      <td className={`py-4 text-right tabular-nums ${s.textSecondary}`}>₹{item.price}</td>
                      <td className={`py-4 text-right tabular-nums ${s.textSecondary}`}>₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-16">
              <div className="w-80 space-y-4">
                <div className={`flex justify-between ${s.textSecondary}`}>
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{subtotal}</span>
                </div>
                <div className={`flex justify-between ${s.textSecondary}`}>
                  <span>GST (18%)</span>
                  <span className="tabular-nums">₹{tax.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-4xl pt-6 border-t ${s.border} ${s.text}`}>
                  <span>Total</span>
                  <span className="tabular-nums">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer with QR */}
            <div className={`border-t ${s.border} pt-12`}>
              <div className={`grid ${showQR ? 'grid-cols-3' : 'grid-cols-2'} gap-12`}>
                <div className={`text-sm ${s.textMuted}`}>
                  <div className="mb-3 text-xs">PAYMENT DETAILS</div>
                  <div className={`space-y-1 ${s.textSecondary}`}>
                    <div>Bank: HDFC Bank</div>
                    <div>Account: 1234567890</div>
                    <div>IFSC: HDFC0001234</div>
                  </div>
                </div>

                {showQR && (
                  <div className="flex flex-col items-center">
                    <div className="mb-3 text-xs text-center" style={{ color: theme === 'dark' ? '#6a6a6a' : '#9ca3af' }}>SCAN TO PAY</div>
                    {/* QR Code Placeholder */}
                    <div className={`w-24 h-24 border-2 ${theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'} flex items-center justify-center`}>
                      <svg viewBox="0 0 100 100" className={`w-20 h-20 ${theme === 'dark' ? 'text-[#6a6a6a]' : 'text-gray-400'}`}>
                        {/* Simplified QR pattern */}
                        <rect x="10" y="10" width="25" height="25" fill="currentColor" />
                        <rect x="65" y="10" width="25" height="25" fill="currentColor" />
                        <rect x="10" y="65" width="25" height="25" fill="currentColor" />
                        <rect x="15" y="15" width="15" height="15" fill={theme === 'dark' ? '#0a0a0a' : 'white'} />
                        <rect x="70" y="15" width="15" height="15" fill={theme === 'dark' ? '#0a0a0a' : 'white'} />
                        <rect x="15" y="70" width="15" height="15" fill={theme === 'dark' ? '#0a0a0a' : 'white'} />
                        <rect x="20" y="20" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="20" width="5" height="5" fill="currentColor" />
                        <rect x="20" y="75" width="5" height="5" fill="currentColor" />
                        <rect x="40" y="10" width="5" height="5" fill="currentColor" />
                        <rect x="50" y="10" width="5" height="5" fill="currentColor" />
                        <rect x="40" y="20" width="10" height="5" fill="currentColor" />
                        <rect x="40" y="30" width="5" height="5" fill="currentColor" />
                        <rect x="55" y="25" width="5" height="10" fill="currentColor" />
                        <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                        <rect x="45" y="45" width="10" height="10" fill={theme === 'dark' ? '#0a0a0a' : 'white'} />
                        <rect x="65" y="40" width="5" height="15" fill="currentColor" />
                        <rect x="75" y="45" width="15" height="5" fill="currentColor" />
                        <rect x="10" y="40" width="5" height="15" fill="currentColor" />
                        <rect x="20" y="45" width="10" height="5" fill="currentColor" />
                        <rect x="40" y="65" width="5" height="25" fill="currentColor" />
                        <rect x="50" y="70" width="10" height="5" fill="currentColor" />
                        <rect x="55" y="80" width="5" height="10" fill="currentColor" />
                        <rect x="65" y="65" width="15" height="5" fill="currentColor" />
                        <rect x="75" y="75" width="15" height="5" fill="currentColor" />
                        <rect x="70" y="85" width="10" height="5" fill="currentColor" />
                      </svg>
                    </div>
                    <div className={`text-xs mt-2 ${s.textSecondary}`}>UPI: demo@upi</div>
                  </div>
                )}

                <div className={`text-sm ${s.textMuted}`}>
                  <div className="mb-3 text-xs">NOTES</div>
                  <div className={s.textSecondary}>
                    Thank you for your business. Payment is due within 14 days.
                  </div>
                </div>
              </div>
            </div>

            {/* Minimal theme - add subtle branding bar at bottom */}
            {theme === 'minimal' && (
              <div className="mt-12 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                Generated by Slate
              </div>
            )}

            {/* Professional theme - add blue accent bar */}
            {theme === 'professional' && (
              <div className="mt-12 h-1 bg-blue-600 rounded" />
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 max-w-4xl mx-auto">
            <Link
              to="/invoices"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Invoices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
