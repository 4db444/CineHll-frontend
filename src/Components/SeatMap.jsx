import { useMemo } from 'react';

export default function SeatMap({
  totalSeats,
  availableSeats,
  takenSeats,
  selectedSeats,
  onSeatClick,
  isVip,
}) {
  // Calculate grid columns based on total seats
  const cols = useMemo(() => {
    if (totalSeats <= 20) return 5;
    if (totalSeats <= 50) return 8;
    if (totalSeats <= 100) return 10;
    return 12;
  }, [totalSeats]);

  const seats = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalSeats; i++) {
      arr.push(i);
    }
    return arr;
  }, [totalSeats]);

  const getSeatStatus = (seatNum) => {
    if (takenSeats.includes(seatNum)) return 'taken';
    if (selectedSeats.includes(seatNum)) return 'selected';
    if (availableSeats.includes(seatNum)) return 'available';
    return 'taken';
  };

  const seatStyles = {
    taken: 'bg-red-500/30 text-red-300 cursor-not-allowed border-red-500/30',
    available: 'bg-white/5 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/50 cursor-pointer border-white/10',
    selected: 'bg-yellow-500 text-black font-bold cursor-pointer border-yellow-400 shadow-lg shadow-yellow-500/20',
  };

  return (
    <div className="w-full">
      {/* Screen */}
      <div className="mb-10 text-center">
        <div className="mx-auto w-3/4 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full mb-2" />
        <span className="text-xs text-gray-500 uppercase tracking-[0.3em]">Écran</span>
      </div>

      {/* Seats Grid */}
      <div
        className="grid gap-2 justify-center mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: `${cols * 48}px` }}
      >
        {seats.map((seatNum) => {
          const status = getSeatStatus(seatNum);
          return (
            <button
              key={seatNum}
              disabled={status === 'taken'}
              onClick={() => status !== 'taken' && onSeatClick(seatNum)}
              className={`
                w-10 h-10 rounded-lg border text-xs font-medium
                transition-all duration-200 flex items-center justify-center
                ${seatStyles[status]}
              `}
              title={`Siège ${seatNum} - ${status === 'taken' ? 'Occupé' : status === 'selected' ? 'Sélectionné' : 'Disponible'}`}
            >
              {seatNum}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/5 border border-white/10" />
          <span className="text-xs text-gray-500">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-yellow-500" />
          <span className="text-xs text-gray-500">Sélectionné</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-500/30 border border-red-500/30" />
          <span className="text-xs text-gray-500">Occupé</span>
        </div>
      </div>

      {/* VIP Notice */}
      {isVip && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
            <span className="text-base">👑</span> Séance VIP — Les sièges doivent être réservés en paires consécutives
          </span>
        </div>
      )}
    </div>
  );
}
