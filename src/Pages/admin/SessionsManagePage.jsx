import { useState, useEffect } from 'react';
import sessionService from '../../services/sessionService';
import movieService from '../../services/movieService';
import roomService from '../../services/roomService';
import Modal from '../../Components/Modal';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { Plus, Pencil, Trash2, CalendarClock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' }, { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' }, { code: 'zh', label: '中文' },
  { code: 'hi', label: 'Hindi' }, { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' }, { code: 'bn', label: 'Bengali' },
  { code: 'ur', label: 'اردو' },
];

const emptySession = { start_at: '', end_at: '', language: 'fr', price: '', room_id: '', movie_id: '', type: 'normal' };

export default function SessionsManagePage() {
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySession);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [sessRes, movRes, roomRes] = await Promise.all([
        sessionService.getAll(),
        movieService.getAll(),
        roomService.getAll(),
      ]);
      setSessions(sessRes.data.sessions || []);
      setMovies(movRes.data.movies || []);
      setRooms(roomRes.data.rooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptySession);
    setModalOpen(true);
  };

  const openEdit = (session) => {
    setEditing(session);
    setForm({
      start_at: session.start_at ? session.start_at.slice(0, 16) : '',
      end_at: session.end_at ? session.end_at.slice(0, 16) : '',
      language: session.language,
      price: session.price,
      room_id: session.room_id,
      movie_id: session.movie_id,
      type: session.type || 'normal',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        room_id: parseInt(form.room_id),
        movie_id: parseInt(form.movie_id),
      };
      if (editing) {
        await sessionService.update(editing.id, payload);
        toast.success('Séance mise à jour');
      } else {
        await sessionService.create(payload);
        toast.success('Séance créée');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error(err.response?.data?.message || 'Erreur');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette séance ?')) return;
    try {
      await sessionService.delete(id);
      toast.success('Séance supprimée');
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
          <CalendarClock className="text-yellow-500" size={28} /> Gestion des Séances
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Salle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date & Heure</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Langue</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-6 py-4 font-medium text-sm">{session.movie?.title || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{session.room?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(session.start_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-sm">{LANGUAGES.find((l) => l.code === session.language)?.label || session.language}</td>
                  <td className="px-6 py-4 text-sm font-bold text-yellow-500">{session.price} MAD</td>
                  <td className="px-6 py-4">
                    {session.type === 'vip' ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">VIP</span>
                    ) : (
                      <span className="text-xs text-gray-500">Normal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(session)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(session.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la séance' : 'Nouvelle séance'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Film</label>
            <select value={form.movie_id} onChange={(e) => setForm({ ...form, movie_id: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition">
              <option value="">-- Choisir un film --</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Salle</label>
            <select value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition">
              <option value="">-- Choisir une salle --</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.total_seats} places{r.is_vip ? ' - VIP' : ''})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Début</label>
              <input type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Fin</label>
              <input type="datetime-local" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Langue</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition">
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition">
                <option value="normal">Normal</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Prix (MAD)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min={0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold uppercase hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : editing ? 'Mettre à jour' : 'Créer la séance'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
