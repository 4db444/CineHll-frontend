import { useState, useEffect } from 'react';
import roomService from '../../services/roomService';
import Modal from '../../Components/Modal';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { Plus, Pencil, Trash2, DoorOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyRoom = { name: '', total_seats: '', is_vip: false };

export default function RoomsManagePage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRoom);
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await roomService.getAll();
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyRoom);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);
    setForm({ name: room.name, total_seats: room.total_seats, is_vip: room.is_vip });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, total_seats: parseInt(form.total_seats), is_vip: !!form.is_vip };
      if (editing) {
        await roomService.update(editing.id, payload);
        toast.success('Salle mise à jour');
      } else {
        await roomService.create(payload);
        toast.success('Salle créée');
      }
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette salle ?')) return;
    try {
      await roomService.delete(id);
      toast.success('Salle supprimée');
      fetchRooms();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
          <DoorOpen className="text-yellow-500" size={28} /> Gestion des Salles
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Places</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-6 py-4 font-medium">{room.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{room.total_seats}</td>
                  <td className="px-6 py-4">
                    {room.is_vip ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">👑 VIP</span>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(room)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la salle' : 'Nouvelle salle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Nom</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Nombre de places</label>
            <input type="number" value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: e.target.value })} required min={10} max={1000} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_vip" checked={form.is_vip} onChange={(e) => setForm({ ...form, is_vip: e.target.checked })} className="w-5 h-5 rounded accent-yellow-500" />
            <label htmlFor="is_vip" className="text-sm font-medium text-gray-300">Salle VIP</label>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold uppercase hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : editing ? 'Mettre à jour' : 'Créer la salle'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
