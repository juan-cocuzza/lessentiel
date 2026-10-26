export default function ProductLoading() {
  return (
    <div role="status" aria-label="Cargando botín" className="section-padding mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
      <div className="aspect-square rounded-sm bg-white/5 motion-safe:animate-pulse" />
      <div className="space-y-6 motion-safe:animate-pulse">
        <div className="h-10 w-3/4 rounded-sm bg-white/10" />
        <div className="h-24 rounded-sm bg-white/5" />
        <div className="h-40 rounded-sm bg-white/5" />
        <span className="sr-only">Cargando botín...</span>
      </div>
    </div>
  );
}
