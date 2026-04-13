import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

export default function AdminGuard() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
