import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { LogOut, User, Ticket, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Nav() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-3xl font-black tracking-tighter text-yellow-500 uppercase">
              CineMax
            </Link>
            <div className="hidden md:flex space-x-6 text-sm font-medium uppercase tracking-widest text-gray-300">
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `hover:text-yellow-500 transition ${isActive ? 'text-yellow-500' : ''}`
                }
              >
                Films
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  to="/reservations"
                  className={({ isActive }) =>
                    `hover:text-yellow-500 transition ${isActive ? 'text-yellow-500' : ''}`
                  }
                >
                  Réservations
                </NavLink>
              )}
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `hover:text-yellow-500 transition ${isActive ? 'text-yellow-500' : ''}`
                  }
                >
                  Admin
                </NavLink>
              )}
            </div>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition"
                >
                  <div className="w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center text-xs font-bold text-yellow-500">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{user?.first_name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <User size={14} /> Mon Profil
                    </Link>
                    <Link
                      to="/reservations"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <Ticket size={14} /> Mes Réservations
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                      >
                        <LayoutDashboard size={14} /> Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition w-full text-left"
                      >
                        <LogOut size={14} /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold uppercase text-gray-300 hover:text-white transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-400 transition uppercase tracking-tighter"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}