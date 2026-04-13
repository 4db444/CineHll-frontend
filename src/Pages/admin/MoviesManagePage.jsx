import { useState, useEffect } from 'react';
import movieService from '../../services/movieService';
import Modal from '../../Components/Modal';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { Plus, Pencil, Trash2, Film, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyMovie = { title: '', description: '', image: '', duration: '', min_age: 0, trailer: '' };

export default function MoviesManagePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMovie);
  const [saving, setSaving] = useState(false);

  const fetchMovies = async () => {
    try {
      const res = await movieService.getAll();
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyMovie);
    setModalOpen(true);
  };

  const openEdit = (movie) => {
    setEditing(movie);
    setForm({
      title: movie.title,
      description: movie.description || '',
      image: movie.image || '',
      duration: movie.duration,
      min_age: movie.min_age,
      trailer: movie.trailer || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, duration: parseInt(form.duration), min_age: parseInt(form.min_age) };
      if (editing) {
        await movieService.update(editing.id, payload);
        toast.success('Film mis à jour');
      } else {
        await movieService.create(payload);
        toast.success('Film créé');
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce film ?')) return;
    try {
      await movieService.delete(id);
      toast.success('Film supprimé');
      fetchMovies();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
          <Film className="text-yellow-500" size={28} /> Gestion des Films
        </h1>
        <button onClick={openCreate} className="bg-yellow-500 text-black px-5 py-2.5 rounded-xl font-bold text-sm uppercase flex items-center gap-2 hover:bg-yellow-400 transition">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Film</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Âge Min</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={movie.image || 'https://via.placeholder.com/40'}
                        alt=""
                        className="w-10 h-14 object-cover rounded"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                      <div>
                        <p className="font-medium">{movie.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{movie.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{movie.duration} min</td>
                  <td className="px-6 py-4 text-sm">{movie.min_age > 0 ? <span className="text-red-400">{movie.min_age}+</span> : <span className="text-gray-500">Tous</span>}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(movie)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(movie.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le film' : 'Nouveau film'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Titre</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Durée (min)</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required min={1} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Âge minimum</label>
              <input type="number" value={form.min_age} onChange={(e) => setForm({ ...form, min_age: e.target.value })} min={0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Image URL</label>
            <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Trailer URL</label>
            <input type="url" value={form.trailer} onChange={(e) => setForm({ ...form, trailer: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold uppercase hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : editing ? 'Mettre à jour' : 'Créer le film'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
