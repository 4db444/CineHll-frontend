import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

export default function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
