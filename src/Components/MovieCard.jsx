import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';

export default function MovieCard({ movie }) {
  const placeholderImg = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000';

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="relative group cursor-pointer overflow-hidden rounded-xl block"
    >
      <img
        src={movie.image || placeholderImg}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover transition duration-500 group-hover:scale-110"
        onError={(e) => { e.target.src = placeholderImg; }}
      />

      {/* Gradient overlay always visible at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />

      {/* Title always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-sm font-bold uppercase tracking-wide truncate">{movie.title}</h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {movie.duration} min
          </span>
          {movie.min_age > 0 && (
            <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">
              {movie.min_age}+
            </span>
          )}
        </div>
      </div>

      {/* Full overlay on hover */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
        <h4 className="text-lg font-bold mb-2 uppercase">{movie.title}</h4>
        <p className="text-gray-400 text-xs mb-4 line-clamp-3">{movie.description}</p>
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock size={12} /> {movie.duration} min</span>
          {movie.min_age > 0 && (
            <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">
              {movie.min_age}+
            </span>
          )}
        </div>
        <span className="border-2 border-yellow-500 text-yellow-500 px-5 py-2 rounded-lg font-bold uppercase text-xs hover:bg-yellow-500 hover:text-black transition">
          Voir Détails
        </span>
      </div>
    </Link>
  );
}
