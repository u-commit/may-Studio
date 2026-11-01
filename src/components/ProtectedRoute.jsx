import { Navigate, useLocation } from 'react-router-dom';
import { DEMO_ADMIN_CREDENTIALS } from '../config/auth';
import { useAuth } from '../contexts/useAuth';

function ProtectedRoute({ requiredRole, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  const role = String(user.role ?? user.roleName ?? '').toLowerCase();
  const isAllowedAdmin = role === 'admin'
    && String(user.email ?? '').trim().toLowerCase() === DEMO_ADMIN_CREDENTIALS.email;
  const isAllowedUser = requiredRole?.toLowerCase() === 'user'
    && ['user', 'customer'].includes(role);
  const hasRequiredRole = requiredRole?.toLowerCase() === 'admin'
    ? isAllowedAdmin
    : requiredRole?.toLowerCase() === 'user'
      ? isAllowedUser
      : !requiredRole || role === requiredRole.toLowerCase();
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
