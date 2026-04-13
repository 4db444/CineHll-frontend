import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import './App.css';

// Layouts
import BaseLayout from './Layouts/BaseLayout';
import AdminLayout from './Layouts/AdminLayout';

// Guards
import AuthGuard from './Middlewares/AuthGuard';
import AdminGuard from './Middlewares/AdminGuard';
import GuestGuard from './Middlewares/GuestGuard';

// Public Pages
import LandingPage from './Pages/LandingPage';
import MoviesPage from './Pages/MoviesPage';
import MovieDetailPage from './Pages/MovieDetailPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

// Protected User Pages
import SeatSelectionPage from './Pages/SeatSelectionPage';
import ReservationsPage from './Pages/ReservationsPage';
import PaymentPage from './Pages/PaymentPage';
import ProfilePage from './Pages/ProfilePage';

// Admin Pages
import DashboardPage from './Pages/admin/DashboardPage';
import MoviesManagePage from './Pages/admin/MoviesManagePage';
import RoomsManagePage from './Pages/admin/RoomsManagePage';
import SessionsManagePage from './Pages/admin/SessionsManagePage';
import UsersManagePage from './Pages/admin/UsersManagePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with BaseLayout */}
          <Route element={<BaseLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />

            {/* Guest-only routes (redirect if authenticated) */}
            <Route element={<GuestGuard />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Authenticated user routes */}
            <Route element={<AuthGuard />}>
              <Route path="/sessions/:sessionId/seats" element={<SeatSelectionPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/reservations/:id/pay" element={<PaymentPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<BaseLayout />}>
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/movies" element={<MoviesManagePage />} />
                <Route path="/admin/rooms" element={<RoomsManagePage />} />
                <Route path="/admin/sessions" element={<SessionsManagePage />} />
                <Route path="/admin/users" element={<UsersManagePage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}