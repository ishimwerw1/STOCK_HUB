export default function Loading({ text = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="flex gap-1.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500 animate-bounce-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-slate-400 animate-pulse">{text}...</p>
    </div>
  );
}
