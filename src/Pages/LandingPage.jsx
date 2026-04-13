import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import MovieCard from '../Components/MovieCard';
import { Ticket, Play, Film, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await movieService.getAll();
        setMovies(res.data.movies || []);
      } catch {
        // If not authenticated or API down, show empty
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovie = movies[0];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={featuredMovie?.image || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070'}
            className="w-full h-full object-cover opacity-60"
            alt="Hero Background"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <span className="bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase mb-4 inline-block rounded">
              À l'affiche
            </span>
            <h2 className="text-6xl md:text-8xl font-black mb-4 leading-none uppercase tracking-tighter">
              {featuredMovie ? (
                <>
                  {featuredMovie.title.split(' ').slice(0, 2).join(' ')}
                  {featuredMovie.title.split(' ').length > 2 && (
                    <>
                      <br />
                      <span className="text-yellow-500">
                        {featuredMovie.title.split(' ').slice(2).join(' ')}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  Bienvenue à<br /><span className="text-yellow-500">CineMax</span>
                </>
              )}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              {featuredMovie?.description?.substring(0, 150) ||
                'Découvrez les meilleurs films et réservez vos places en quelques clics.'}
              {featuredMovie?.description?.length > 150 ? '...' : ''}
            </p>
            <div className="flex gap-4">
              <Link
                to={featuredMovie ? `/movies/${featuredMovie.id}` : '/movies'}
                className="bg-yellow-500 text-black px-8 py-4 rounded-sm font-black uppercase flex items-center gap-3 hover:scale-105 transition active:scale-95"
              >
                <Ticket size={18} /> Réserver
              </Link>
              {featuredMovie?.trailer && (
                <a
                  href={featuredMovie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-sm font-black uppercase flex items-center gap-3 hover:bg-white/20 transition"
                >
                  <Play size={18} /> Bande-annonce
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Film className="text-yellow-500" size={28} /> En ce moment
            </h3>
            <div className="h-1 w-20 bg-yellow-500 mt-2" />
          </div>
          <Link to="/movies" className="text-yellow-500 font-bold uppercase text-sm hover:underline flex items-center gap-2">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Film size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 text-lg">Aucun film disponible pour le moment</p>
            <p className="text-gray-600 text-sm mt-1">Connectez-vous pour accéder au catalogue</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.slice(0, 10).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}