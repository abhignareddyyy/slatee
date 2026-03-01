import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { QuickSearch } from './quick-search';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  // Global search shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/new-order', label: 'New Order' },
    { path: '/orders', label: 'Orders' },
    { path: '/deliveries', label: 'Deliveries' },
    { path: '/invoices', label: 'Invoices' },
    { path: '/customers', label: 'Customers' },
    { path: '/products', label: 'Products' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/team', label: 'Team' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/exports', label: 'Exports' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <>
      <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-colors">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex justify-between items-center">
          <h1 className="text-xl tracking-tight text-sidebar-foreground">Slate</h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-full transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Search Trigger */}
        <div className="p-4 pb-2">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-sidebar-accent text-sidebar-foreground/70 border border-sidebar-border rounded text-sm hover:text-sidebar-foreground transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search...</span>
            </div>
            <span className="text-xs border border-sidebar-border px-1.5 py-0.5 rounded">⌘K</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 pt-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === '/dashboard' && location.pathname === '/dashboard');

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 transition-colors rounded ${isActive
                      ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-sidebar-border">
          <div className="text-sm">
            <div className="text-sidebar-foreground font-medium">Demo Business</div>
            <div className="text-sidebar-foreground/70 mt-1">demo@slate.app</div>
          </div>
        </div>
      </div>

      {/* Quick Search Modal */}
      <QuickSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
