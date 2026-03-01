import { Sidebar } from './sidebar';

export function Exports() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">Exports</h1>
            <p className="text-muted-foreground">Download order and invoice data</p>
          </div>

          {/* Export Options */}
          <div className="max-w-2xl space-y-8">
            {/* Date Range */}
            <div className="border border-border p-8 bg-card">
              <h2 className="text-2xl mb-6">Export Data</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">From Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">To Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Export Format</label>
                  <select className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors">
                    <option>PDF</option>
                    <option>CSV</option>
                    <option>Excel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Data Type</label>
                  <select className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors">
                    <option>All Data</option>
                    <option>Orders Only</option>
                    <option>Invoices Only</option>
                    <option>Payments Only</option>
                  </select>
                </div>

                <button className="w-full px-8 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium">
                  Generate Export
                </button>
              </div>
            </div>

            {/* Recent Exports */}
            <div>
              <h2 className="text-2xl mb-6">Recent Exports</h2>
              <div className="border border-border bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Format</th>
                      <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4">25 Dec 2025</td>
                      <td className="p-4">All Data</td>
                      <td className="p-4">CSV</td>
                      <td className="p-4 text-right">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          Download
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">20 Dec 2025</td>
                      <td className="p-4">Invoices</td>
                      <td className="p-4">PDF</td>
                      <td className="p-4 text-right">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
