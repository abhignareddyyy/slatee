import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { useAuth } from './auth-provider';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl">Check your email</h2>
          <p className="text-muted-foreground">
            We've sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 text-muted-foreground border border-border hover:border-foreground transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="mb-16 text-center">
          <h1 className="text-2xl tracking-tight">Slate</h1>
        </div>

        {/* Signup Form */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl mb-2">Create Account</h2>
            <p className="text-muted-foreground">Start converting orders to invoices</p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="businessName" className="block text-sm text-muted-foreground">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                placeholder="Your Business Ltd."
              />
            </div>

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
                minLength={6}
                className="w-full px-4 py-3 bg-card border border-border text-foreground focus:outline-none focus:border-ring transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="block w-full px-4 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all text-center font-medium disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-foreground hover:text-primary transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
