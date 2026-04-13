import { useState, useEffect } from 'react';
import movieService from '../services/movieService';
import MovieCard from '../Components/MovieCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Search, Film } from 'lucide-react';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await movieService.getAll();
        setMovies(res.data.movies || []);
        setFiltered(res.data.movies || []);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(movies);
    } else {
      const q = search.toLowerCase();
      setFiltered(movies.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
      ));
    }
  }, [search, movies]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Film className="text-yellow-500" size={28} />
              <h1 className="text-4xl font-black uppercase tracking-tighter">Tous les Films</h1>
            </div>
            <div className="h-1 w-20 bg-yellow-500 mt-1" />
            <p className="text-gray-400 mt-3">{filtered.length} film{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Film size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 text-lg">Aucun film trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
