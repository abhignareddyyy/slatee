import { Sidebar } from './sidebar';

export function Settings() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure your account and invoice preferences</p>
          </div>

          {/* Settings Sections */}
          <div className="max-w-3xl space-y-12">
            {/* Business Profile */}
            <div className="border-b border-border pb-12">
              <h2 className="text-2xl mb-6">Business Profile</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Business Name</label>
                    <input
                      type="text"
                      defaultValue="Demo Business Ltd."
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">GST/VAT ID</label>
                    <input
                      type="text"
                      defaultValue="27XXXXX1234X1Z5"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Address</label>
                  <textarea
                    defaultValue="123 Business Street&#10;Mumbai 400001"
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="demo@slate.app"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="border-b border-border pb-12">
              <h2 className="text-2xl mb-6">Invoice Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      defaultValue="INV"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Next Invoice Number</label>
                    <input
                      type="number"
                      defaultValue="422"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Default Tax Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="18"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Payment Terms (days)</label>
                    <input
                      type="number"
                      defaultValue="14"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Default Invoice Notes</label>
                  <textarea
                    defaultValue="Thank you for your business. Payment is due within 14 days."
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="border-b border-border pb-12">
              <h2 className="text-2xl mb-6">Export Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Export Format</label>
                  <select className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors">
                    <option>PDF</option>
                    <option>CSV</option>
                    <option>Excel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Date Range for Exports</label>
                  <select className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div>
              <h2 className="text-2xl mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="demo@slate.app"
                    className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Change Password</label>
                  <button className="px-6 py-2 text-muted-foreground border border-border hover:border-foreground transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-12 max-w-3xl">
            <button className="px-8 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
