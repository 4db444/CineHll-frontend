import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(form);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        toast.error(data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070"
          className="w-full h-full object-cover opacity-20"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-yellow-500">CineMax</h1>
          <p className="text-gray-400 mt-2">Créer un nouveau compte</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <User size={14} /> Prénom
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition"
                  placeholder="Prénom"
                />
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name[0]}</p>}
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
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition"
                  placeholder="Nom"
                />
                {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name[0]}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition"
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock size={14} /> Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition"
                placeholder="Min 8 chars, mixte, chiffres, symboles"
              />
              {errors.password && (
                <div className="text-red-400 text-xs mt-1">
                  {Array.isArray(errors.password)
                    ? errors.password.map((e, i) => <p key={i}>{e}</p>)
                    : errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock size={14} /> Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Inscription...</>
              ) : (
                <><UserPlus size={18} /> S'inscrire</>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-yellow-500 font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
