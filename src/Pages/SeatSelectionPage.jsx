import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionService from '../services/sessionService';
import reservationService from '../services/reservationService';
import SeatMap from '../Components/SeatMap';
import LoadingSpinner from '../Components/LoadingSpinner';
import { ArrowLeft, Ticket, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeatSelectionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, seatsRes] = await Promise.all([
          sessionService.getById(sessionId),
          sessionService.getAvailableSeats(sessionId),
        ]);
        setSession(sessionRes.data.session);
        setSeatData(seatsRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Impossible de charger la séance');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  const handleSeatClick = (seatNum) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNum)) {
        return prev.filter((s) => s !== seatNum);
      }
      if (prev.length >= 10) {
        toast.error('Maximum 10 sièges par réservation');
        return prev;
      }
      return [...prev, seatNum].sort((a, b) => a - b);
    });
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Sélectionnez au moins un siège');
      return;
    }

    // VIP validation
    if (seatData?.is_vip) {
      if (selectedSeats.length % 2 !== 0) {
        toast.error('Les séances VIP nécessitent un nombre pair de sièges (couples)');
        return;
      }
      const sorted = [...selectedSeats].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length; i += 2) {
        if (sorted[i + 1] - sorted[i] !== 1) {
          toast.error('Les sièges VIP doivent être en paires consécutives');
          return;
        }
      }
    }

    setBooking(true);
    try {
      const res = await reservationService.create({
        session_id: parseInt(sessionId),
        seat_numbers: selectedSeats,
      });
      toast.success('Réservation créée ! Procédez au paiement.');
      navigate(`/reservations/${res.data.reservation.id}/pay`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Échec de la réservation';
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!session || !seatData) return (
    <div className="pt-24 text-center text-gray-400">Séance introuvable</div>
  );

  const totalPrice = (session.price * selectedSeats.length).toFixed(2);

  return (
    <div className="pt-24 pb-16 max-w-5xl mx-auto px-4">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 text-sm">
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Session Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              {session.movie?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
              <span>🏠 {session.room?.name}</span>
              <span>📅 {new Date(session.start_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span>🕐 {new Date(session.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              <span>💰 {session.price} MAD / siège</span>
              {seatData.is_vip && <span className="text-amber-400">👑 VIP</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-center">Choisissez vos sièges</h2>
        <SeatMap
          totalSeats={seatData.total_seats}
          availableSeats={seatData.available_seats}
          takenSeats={seatData.taken_seats}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          isVip={seatData.is_vip}
        />
      </div>

      {/* Summary & Book */}
      {selectedSeats.length > 0 && (
        <div className="sticky bottom-4 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {selectedSeats.length} siège{selectedSeats.length > 1 ? 's' : ''} sélectionné{selectedSeats.length > 1 ? 's' : ''}:
                <span className="text-white font-medium ml-2">
                  {selectedSeats.join(', ')}
                </span>
              </p>
              <p className="text-2xl font-black text-yellow-500 mt-1">
                {totalPrice} MAD
              </p>
            </div>

            <button
              onClick={handleReserve}
              disabled={booking}
              className="bg-yellow-500 text-black px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-yellow-400 transition disabled:opacity-50 flex items-center gap-2"
            >
              {booking ? (
                <><Loader2 size={18} className="animate-spin" /> Réservation...</>
              ) : (
                <><Ticket size={18} /> Réserver & Payer</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
