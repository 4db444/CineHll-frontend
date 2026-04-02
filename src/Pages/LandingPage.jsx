export default function LandingPage() {
    return <>
        <section className="relative h-[85vh] flex items-end pb-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070"
                    className="w-full h-full object-cover opacity-60"
                    alt="Hero Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl">
                    <span className="bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase mb-4 inline-block">À l'affiche</span>
                    <h2 className="text-6xl md:text-8xl font-black mb-4 leading-none uppercase tracking-tighter">
                        Dune: <br /><span className="text-yellow-500">Partie II</span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-md">
                        Vivez l'épopée mythique de Paul Atreides alors qu'il s'unit à Chani et aux Fremen pour se venger des conspirateurs.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-yellow-500 text-black px-8 py-4 rounded-sm font-black uppercase flex items-center gap-3 hover:scale-105 transition active:scale-95">
                            <i className="fas fa-ticket"></i> Réserver
                        </button>
                        <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-sm font-black uppercase flex items-center gap-3 hover:bg-white/20 transition">
                            <i className="fas fa-play"></i> Bande-annonce
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Movies Grid */}
        <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">En ce moment</h3>
                    <div className="h-1 w-20 bg-yellow-500 mt-2"></div>
                </div>
                <a href="#" className="text-yellow-500 font-bold uppercase text-sm hover:underline">
                    Voir tout <i className="fas fa-arrow-right ml-2"></i>
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Movie Card Component Mapping would go here */}
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="relative group cursor-pointer overflow-hidden rounded-lg">
                        <img
                            src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000`}
                            alt="Movie"
                            className="w-full aspect-[2/3] object-cover transition duration-500 group-hover:scale-110"
                        />
                        {/* Overlay replaces the old .movie-card:hover CSS */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                            <span className="text-yellow-500 font-bold mb-2 text-xs">SCI-FI / ACTION</span>
                            <h4 className="text-xl font-bold mb-4 uppercase">Interstellar</h4>
                            <button className="border-2 border-yellow-500 text-yellow-500 px-4 py-2 rounded font-bold uppercase text-xs hover:bg-yellow-500 hover:text-black transition">
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </>
}