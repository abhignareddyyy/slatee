import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-8 py-24">
        {/* Wordmark */}
        <div className="mb-32">
          <h1 className="text-2xl tracking-tight">Slate</h1>
        </div>

        {/* Main Content */}
        <div className="grid gap-24">
          {/* Headline */}
          <div className="max-w-3xl">
            <h2 className="text-6xl leading-tight mb-8 tracking-tight">
              From WhatsApp Messages<br />
              to Clean Invoices
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Slate converts unstructured WhatsApp orders into structured data<br />
              and generates professional, print-ready invoices for small businesses.
            </p>
          </div>

          {/* Visual Flow */}
          <div className="border-t border-border pt-16">
            <div className="grid grid-cols-3 gap-12 text-sm">
              <div>
                <div className="mb-4 text-muted-foreground">01 — Input</div>
                <div className="bg-card border border-border p-6 min-h-[200px] font-mono text-card-foreground">
                  <div className="text-muted-foreground">
                    <p>Hi! Need 5 bags rice</p>
                    <p>2kg sugar</p>
                    <p>Send to Park St</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 text-muted-foreground">02 — Parsed</div>
                <div className="bg-card border border-border p-6 min-h-[200px] text-card-foreground">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left pb-2 text-muted-foreground">Item</th>
                        <th className="text-right pb-2 text-muted-foreground">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="text-foreground">
                      <tr>
                        <td className="py-1">Rice (bags)</td>
                        <td className="text-right">5</td>
                      </tr>
                      <tr>
                        <td className="py-1">Sugar</td>
                        <td className="text-right">2kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="mb-4 text-muted-foreground">03 — Invoice</div>
                <div className="bg-card border border-border p-6 min-h-[200px] text-card-foreground">
                  <div className="text-xs">
                    <div className="mb-4 pb-3 border-b border-border">
                      <div className="text-muted-foreground">Invoice #0421</div>
                    </div>
                    <div className="space-y-1 text-foreground">
                      <div className="flex justify-between">
                        <span>Rice (bags) × 5</span>
                        <span>₹500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sugar 2kg × 1</span>
                        <span>₹80</span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 border-t border-border">
                        <span>Total</span>
                        <span>₹580</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-muted-foreground border border-border hover:border-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
