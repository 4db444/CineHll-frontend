export default function Footer() {
    return <footer className="bg-black py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tighter text-yellow-500 uppercase">CineMax</h1>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
                <a href="#" className="hover:text-white transition">Mentions Légales</a>
                <a href="#" className="hover:text-white transition">Contact</a>
                <a href="#" className="hover:text-white transition">FAQ</a>
            </div>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">
                © 2026 CineMax Morocco
            </p>
        </div>
    </footer>
}