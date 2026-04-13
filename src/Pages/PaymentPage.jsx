import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import paymentService from '../services/paymentService';
import reservationService from '../services/reservationService';
import PaymentForm from '../Components/PaymentForm';
import LoadingSpinner from '../Components/LoadingSpinner';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentRecord, setPaymentRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const initPayment = async () => {
      try {
        // First fetch reservation details
        const resRes = await reservationService.getById(id);
        const reservationData = resRes.data.reservation;
        setReservation(reservationData);

        // If already paid, show success
        if (reservationData.status === 'paid') {
          setPaid(true);
          setLoading(false);
          return;
        }

        // Create payment intent
        const payRes = await paymentService.pay(id);
        setClientSecret(payRes.data.client_secret);
        setPaymentRecord(payRes.data.payment);
      } catch (err) {
        const msg = err.response?.data?.message || 'Erreur lors de l\'initialisation du paiement';
        toast.error(msg);
        if (err.response?.status === 400 || err.response?.status === 403) {
          navigate('/reservations');
        }
      } finally {
        setLoading(false);
      }
    };
    initPayment();
  }, [id, navigate]);

  const handleSuccess = () => {
    setPaid(true);
    toast.success('Paiement réussi !');
  };

  const handleError = (msg) => {
    toast.error(msg || 'Le paiement a échoué');
  };

  if (loading) return <LoadingSpinner />;

  // Already paid state
  if (paid) {
    return (
      <div className="pt-24 pb-16 max-w-lg mx-auto px-4 text-center">
        <div className="bg-white/5 border border-green-500/20 rounded-2xl p-10">
          <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
          <h1 className="text-3xl font-black mb-2">Paiement Confirmé !</h1>
          <p className="text-gray-400 mb-6">
            Votre réservation est confirmée. Vous pouvez télécharger votre ticket.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/reservations')}
              className="bg-yellow-500 text-black py-3 rounded-xl font-bold uppercase hover:bg-yellow-400 transition"
            >
              Voir mes réservations
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold uppercase hover:bg-white/10 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret || !reservation) {
    return (
      <div className="pt-24 text-center text-gray-400">
        Impossible de charger le paiement
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: { colorPrimary: '#eab308' },
    },
  };

  return (
    <div className="pt-24 pb-16 max-w-lg mx-auto px-4">
      {/* Back */}
      <button onClick={() => navigate('/reservations')} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 text-sm">
        <ArrowLeft size={16} /> Retour aux réservations
      </button>

      {/* Reservation Summary */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="font-bold mb-3">Résumé de la réservation</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Film</span>
            <span className="font-medium">{reservation.session?.movie?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Salle</span>
            <span>{reservation.session?.room?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Séance</span>
            <span>{new Date(reservation.session?.start_at).toLocaleString('fr-FR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sièges</span>
            <span>{reservation.reserved_seats?.map((s) => s.seat_number).join(', ')}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-gray-400 font-bold">Total</span>
            <span className="text-yellow-500 font-black text-lg">{reservation.total_price} MAD</span>
          </div>
        </div>
      </div>

      {/* Stripe Payment Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="font-bold mb-6">Paiement sécurisé</h2>
        <Elements stripe={stripePromise} options={stripeOptions}>
          <PaymentForm
            clientSecret={clientSecret}
            amount={paymentRecord?.amount || reservation.total_price * 100}
            currency={paymentRecord?.currency || 'mad'}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
      </div>
    </div>
  );
}
