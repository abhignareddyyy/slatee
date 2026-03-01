import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { useAuth } from './auth-provider';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="mb-16 text-center">
          <h1 className="text-2xl tracking-tight">Slate</h1>
        </div>

        {/* Login Form */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl mb-2">Sign In</h2>
            <p className="text-muted-foreground">Access your account</p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="block w-full px-4 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all text-center font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-foreground hover:text-primary transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
