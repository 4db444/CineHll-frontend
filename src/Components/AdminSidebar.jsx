import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  DoorOpen,
  CalendarClock,
  Users,
  ArrowLeft,
} from 'lucide-react';

const links = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/movies', icon: Film, label: 'Films' },
  { to: '/admin/rooms', icon: DoorOpen, label: 'Salles' },
  { to: '/admin/sessions', icon: CalendarClock, label: 'Séances' },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0d0d1a] border-r border-white/5 flex flex-col">
      {/* Logo / Back */}
      <div className="p-6 border-b border-white/5">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
        >
          <ArrowLeft size={16} />
          <span>Retour au site</span>
        </NavLink>
        <h2 className="text-xl font-black text-yellow-500 uppercase tracking-tighter mt-3">
          CineMax Admin
        </h2>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center">
          Panel Admin v1.0
        </p>
      </div>
    </aside>
  );
}
