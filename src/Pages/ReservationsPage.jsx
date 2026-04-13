import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservationService from '../services/reservationService';
import paymentService from '../services/paymentService';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Ticket, CreditCard, XCircle, Download, Calendar, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  canceled: 'Annulée',
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await reservationService.getAll();
      setReservations(res.data.reservations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await reservationService.cancel(id);
      toast.success('Réservation annulée');
      fetchReservations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const handleDownloadTicket = async (id) => {
    try {
      const res = await paymentService.downloadTicket(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `cinehall-ticket-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Ticket téléchargé !');
    } catch (err) {
      toast.error('Impossible de télécharger le ticket');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <Ticket className="text-yellow-500" size={28} />
        <h1 className="text-3xl font-black uppercase tracking-tighter">Mes Réservations</h1>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Ticket size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500 text-lg mb-4">Aucune réservation pour le moment</p>
          <Link to="/movies" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold uppercase text-sm hover:bg-yellow-400 transition">
            Voir les films
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const session = reservation.session;
            const movie = session?.movie;
            const room = session?.room;
            const seats = reservation.reserved_seats || [];
            const startDate = session ? new Date(session.start_at) : null;

            return (
              <div
                key={reservation.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Poster */}
                  {movie && (
                    <img
                      src={movie.image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200'}
                      alt={movie.title}
                      className="w-24 h-36 object-cover rounded-xl hidden md:block"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200'; }}
                    />
                  )}

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{movie?.title || 'Film'}</h3>
                        <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[reservation.status]}`}>
                          {STATUS_LABELS[reservation.status]}
                        </span>
                      </div>
                      <span className="text-2xl font-black text-yellow-500 whitespace-nowrap">
                        {reservation.total_price} MAD
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      {startDate && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      )}
                      {room && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} /> {room.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Ticket size={13} />
                        Sièges: {seats.map((s) => s.seat_number).join(', ')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {reservation.status === 'pending' && (
                        <>
                          <Link
                            to={`/reservations/${reservation.id}/pay`}
                            className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold text-xs uppercase hover:bg-yellow-400 transition"
                          >
                            <CreditCard size={14} /> Payer
                          </Link>
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2 rounded-lg font-bold text-xs uppercase hover:bg-red-500/20 transition border border-red-500/20"
                          >
                            <XCircle size={14} /> Annuler
                          </button>
                        </>
                      )}
                      {reservation.status === 'paid' && (
                        <button
                          onClick={() => handleDownloadTicket(reservation.id)}
                          className="flex items-center gap-2 bg-green-500/10 text-green-400 px-5 py-2 rounded-lg font-bold text-xs uppercase hover:bg-green-500/20 transition border border-green-500/20"
                        >
                          <Download size={14} /> Télécharger Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
