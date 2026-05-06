import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, user, getDashboardPath } = useAuth();
  const location = useLocation();

  // Non authentifié → rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Authentifié mais rôle non autorisé → rediriger vers son dashboard
  if (allowedRoles?.length && !hasRole(allowedRoles)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  // Authentifié et autorisé → afficher la page
  return <Outlet />;
};

export default ProtectedRoute;