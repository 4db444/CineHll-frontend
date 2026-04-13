export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-yellow-500/20 rounded-full animate-spin border-t-yellow-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-yellow-400/20 rounded-full animate-spin animate-reverse border-b-yellow-400"></div>
        </div>
      </div>
    </div>
  );
}
