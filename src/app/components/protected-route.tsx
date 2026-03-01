import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth-provider';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show loading spinner while checking auth
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login, preserving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
