import songs from "../../../../data/songs.json";

export default function Songs() {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Folk archive</h1>
        <p className="section-sub">Lyrics + meaning with singer credit. Community licensed.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {(songs as any[]).map((s) => (
          <div key={s.id} className="card">
            <p className="font-bold">{s.title} <span className="text-teal/70 font-medium">• {s.titleDevanagari}</span></p>
            <p className="text-sm text-teal/70 mt-1">{s.meaning_en}</p>
            <div className="rounded-xl bg-cream border border-line p-3 mt-3">
              <p className="label">Lyric snippet</p>
              <p className="font-medium mt-1">{s.lyricsSnippet}</p>
            </div>
            <p className="text-xs text-teal/70 mt-2">{s.singerCredit} • {s.license}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
