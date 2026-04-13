import { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { User, Mail, Save, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profil mis à jour !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <User className="text-yellow-500" size={28} />
        <h1 className="text-3xl font-black uppercase tracking-tighter">Mon Profil</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-8 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-3xl font-black text-yellow-500 border-2 border-yellow-500/30">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
              <p className="text-gray-400 flex items-center gap-1.5 mt-1">
                <Mail size={14} /> {user?.email}
              </p>
              {user?.is_admin && (
                <span className="inline-block mt-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  👑 Administrateur
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User size={14} /> Prénom
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User size={14} /> Nom
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-600 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-black px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-yellow-400 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Enregistrement...</>
            ) : (
              <><Save size={18} /> Enregistrer</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
