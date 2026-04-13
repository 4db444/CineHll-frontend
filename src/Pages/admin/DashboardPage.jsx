import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { Film, CalendarClock, Ticket, Users, TrendingUp, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-gray-400">Données non disponibles</div>;

  const statCards = [
    { label: 'Films', value: data.overview?.movies, icon: Film, color: 'from-blue-500 to-blue-600' },
    { label: 'Séances', value: data.overview?.sessions, icon: CalendarClock, color: 'from-purple-500 to-purple-600' },
    { label: 'Réservations', value: data.overview?.reservations, icon: Ticket, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Tickets Vendus', value: data.overview?.tickets, icon: BarChart3, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-black">{stat.value ?? 0}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-yellow-500" /> Revenus
          </h2>
          <p className="text-4xl font-black text-yellow-500">
            {data.revenue?.total ?? 0} <span className="text-lg text-gray-400">MAD</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Taux d'occupation: <span className="text-white font-bold">{data.occupancy_rate ?? 0}%</span>
          </p>
        </div>

        {/* Users */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users size={18} className="text-yellow-500" /> Utilisateurs
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black">{data.users?.total ?? 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{data.users?.active ?? 0}</p>
              <p className="text-xs text-gray-500 mt-1">Actifs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400">{data.users?.admins ?? 0}</p>
              <p className="text-xs text-gray-500 mt-1">Admins</p>
            </div>
          </div>
        </div>

        {/* Popular Movies */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Film size={18} className="text-yellow-500" /> Films Populaires
          </h2>
          {data.popular_movies?.length > 0 ? (
            <div className="space-y-3">
              {data.popular_movies.map((movie, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-yellow-500/10 rounded-lg flex items-center justify-center text-xs font-bold text-yellow-500">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm">{movie.title}</span>
                  </div>
                  <span className="text-sm text-gray-400">{movie.tickets_sold} tickets</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée</p>
          )}
        </div>

        {/* Revenue per Movie */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-yellow-500" /> Revenus par Film
          </h2>
          {data.revenue_per_movie?.length > 0 ? (
            <div className="space-y-3">
              {data.revenue_per_movie.map((movie, idx) => {
                const maxRevenue = Math.max(...data.revenue_per_movie.map((m) => m.revenue));
                const width = maxRevenue > 0 ? (movie.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{movie.title}</span>
                      <span className="text-yellow-500 font-bold">{movie.revenue} MAD</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée</p>
          )}
        </div>
      </div>
    </div>
  );
}
