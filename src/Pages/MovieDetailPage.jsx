import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import movieService from '../services/movieService';
import sessionService from '../services/sessionService';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Clock, Calendar, Globe, DollarSign, Users, Play, Ticket } from 'lucide-react';

const LANG_LABELS = {
  en: 'English', zh: '中文', hi: 'Hindi', es: 'Español',
  fr: 'Français', ar: 'العربية', bn: 'Bengali', pt: 'Português',
  ru: 'Русский', ur: 'اردو', de: 'Deutsch',
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, sessionsRes] = await Promise.all([
          movieService.getById(id),
          sessionService.getAll(),
        ]);
        setMovie(movieRes.data.movie);
        // Filter sessions for this movie
        const allSessions = sessionsRes.data.sessions || [];
        setSessions(allSessions.filter((s) => s.movie_id == id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!movie) return (
    <div className="pt-24 text-center text-gray-400">Film introuvable</div>
  );

  const placeholderImg = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000';

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={movie.image || placeholderImg}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
          onError={(e) => { e.target.src = placeholderImg; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-12">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <img
              src={movie.image || placeholderImg}
              alt={movie.title}
              className="hidden md:block w-48 rounded-xl shadow-2xl border-2 border-white/10"
              onError={(e) => { e.target.src = placeholderImg; }}
            />

            <div className="flex-1">
              {movie.min_age > 0 && (
                <span className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold mb-3 border border-red-500/20">
                  {movie.min_age}+
                </span>
              )}
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-yellow-500" /> {movie.duration} min
                </span>
              </div>

              <div className="flex gap-3">
                {movie.trailer && (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-bold uppercase text-sm flex items-center gap-2 hover:bg-white/20 transition"
                  >
                    <Play size={16} /> Bande-annonce
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-gray-400 leading-relaxed text-lg">{movie.description}</p>
          </div>

          {/* Info Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-lg mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Durée</span>
                <span>{movie.duration} minutes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Âge minimum</span>
                <span>{movie.min_age > 0 ? `${movie.min_age}+` : 'Tout public'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Séances</span>
                <span className="text-yellow-500 font-bold">{sessions.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Calendar className="text-yellow-500" size={24} />
            Séances disponibles
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <Calendar size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500">Aucune séance programmée pour ce film</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => {
                const startDate = new Date(session.start_at);
                const isVip = session.type === 'vip' || session.room?.is_vip;
                return (
                  <div
                    key={session.id}
                    className={`bg-white/5 border rounded-xl p-5 hover:bg-white/8 transition ${
                      isVip ? 'border-amber-500/30' : 'border-white/10'
                    }`}
                  >
                    {isVip && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded mb-3 border border-amber-500/20">
                        👑 VIP
                      </span>
                    )}

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">
                          {startDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-yellow-500 font-black text-xl">
                          {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className="text-2xl font-black text-yellow-500">
                        {session.price} <span className="text-xs text-gray-400">MAD</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Globe size={12} /> {LANG_LABELS[session.language] || session.language}
                      </span>
                      {session.room && (
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {session.room.name}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/sessions/${session.id}/seats`}
                      className="w-full bg-yellow-500 text-black py-2.5 rounded-lg font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-yellow-400 transition"
                    >
                      <Ticket size={14} /> Réserver
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
