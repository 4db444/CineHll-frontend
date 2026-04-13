import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Loader2 } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#6b7280' },
    },
    invalid: { color: '#ef4444' },
  },
};

export default function PaymentForm({ clientSecret, amount, currency, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError?.(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency || 'MAD',
  }).format(amount / 100);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display */}
      <div className="text-center p-6 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-xl border border-yellow-500/20">
        <p className="text-sm text-gray-400 mb-1">Montant à payer</p>
        <p className="text-4xl font-black text-yellow-500">{formattedAmount}</p>
      </div>

      {/* Card Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <CreditCard size={16} /> Carte bancaire
        </label>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl focus-within:border-yellow-500/50 transition">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-wider
          hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Traitement...
          </>
        ) : (
          <>
            <CreditCard size={20} /> Payer {formattedAmount}
          </>
        )}
      </button>

      {/* Test card hint */}
      <p className="text-center text-xs text-gray-600">
        Mode test — Utilisez la carte: 4242 4242 4242 4242
      </p>
    </form>
  );
}
