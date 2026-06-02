export default function Loading({ text = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 animate-bounce-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-20">
          <div className="w-12 h-12 border-2 border-blue-400 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-slate-400 animate-pulse">{text}...</p>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
      </div>
    </div>
  );
}
