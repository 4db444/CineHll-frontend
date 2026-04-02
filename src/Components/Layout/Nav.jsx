import { NavLink } from "react-router-dom";

export default function Nav() {
    return <nav className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-3xl font-black tracking-tighter text-yellow-500 uppercase">CineMax</h1>
                    <div className="hidden md:flex space-x-6 text-sm font-medium uppercase tracking-widest text-gray-300">
                        <NavLink to="#" className="hover:text-yellow-500 transition">Films</NavLink>
                        <NavLink to="#" className="hover:text-yellow-500 transition">Cinémas</NavLink>
                        <NavLink to="#" className="hover:text-yellow-500 transition">Offres</NavLink>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-sm font-bold uppercase border-b-2 border-yellow-500 pb-1">
                        Safi <i className="fas fa-chevron-down ml-1 text-xs"></i>
                    </button>
                    <button className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-400 transition uppercase tracking-tighter">
                        Connexion
                    </button>
                </div>
            </div>
        </div>
    </nav>
}