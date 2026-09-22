export default function About({ params }: { params: { locale: string } }) {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">About + contribute</h1>
        <p className="section-sub">MIT open-source. Code, dates, ghats and songs are open data.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card">
          <p className="font-bold">1. Content, no code</p>
          <p className="text-sm text-teal/70 mt-1">Translate <code>messages/*.json</code>, add a ghat in <code>data/ghats.json</code>, add lyrics in <code>data/songs.json</code>.</p>
        </div>
        <div className="card">
          <p className="font-bold">2. Code</p>
          <p className="text-sm text-teal/70 mt-1">Branch <code>feat/name</code>. PRs must pass <code>npm run build</code>. Mobile-first.</p>
        </div>
        <div className="card">
          <p className="font-bold">3. Verify</p>
          <p className="text-sm text-teal/70 mt-1">Dates re-verified from DrikPanchang each October. Ghats and photos need approval.</p>
        </div>
      </div>
      <div className="card">
        <h2 className="font-bold">Palette</h2>
        <p className="section-sub">Three colors only.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[["Teal", "#16564F"], ["Mustard", "#E8B84B"], ["Cream", "#FFF8F3"]].map(([n, h]) => (
            <span key={h} className="chip">{n} {h}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <a href={`/${params.locale}/ghats`} className="btn btn-primary text-sm">Add ghat</a>
          <a href={`/${params.locale}/wall`} className="btn btn-ghost text-sm">Share photo</a>
        </div>
      </div>
    </div>
  );
}
