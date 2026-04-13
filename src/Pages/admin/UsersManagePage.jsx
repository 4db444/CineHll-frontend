import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { Users, ShieldCheck, ShieldOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersManagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id) => {
    setActionLoading(id);
    try {
      await adminService.banUser(id);
      toast.success('Utilisateur banni');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.Error || 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (id) => {
    setActionLoading(id);
    try {
      await adminService.unbanUser(id);
      toast.success('Utilisateur débanni');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.Error || 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8">
        <Users className="text-yellow-500" size={28} /> Gestion des Utilisateurs
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun utilisateur
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                    <td className="px-6 py-4 text-sm text-gray-400">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-500/10 rounded-full flex items-center justify-center text-xs font-bold text-yellow-500">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <span className="font-medium">{user.first_name} {user.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                          Actif
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                          Banni
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {actionLoading === user.id ? (
                        <Loader2 size={18} className="animate-spin text-gray-400 inline-block" />
                      ) : user.is_active ? (
                        <button
                          onClick={() => handleBan(user.id)}
                          className="flex items-center gap-1.5 ml-auto bg-red-500/10 text-red-400 px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-red-500/20 transition border border-red-500/20"
                        >
                          <ShieldOff size={14} /> Bannir
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnban(user.id)}
                          className="flex items-center gap-1.5 ml-auto bg-green-500/10 text-green-400 px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-green-500/20 transition border border-green-500/20"
                        >
                          <ShieldCheck size={14} /> Débannir
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
