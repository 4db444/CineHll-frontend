import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

export default function GuestGuard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
