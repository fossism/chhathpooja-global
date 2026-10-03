import songs from "../../../../data/songs.json";
import SongCard from "../../../components/SongCard";

export default function Songs() {
  return (
    <div className="shell py-10">
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Folk archive</h1>
        <p className="section-sub">Lyrics + meaning with singer credit. Community licensed. Press Listen to hear any song read aloud.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {(songs as any[]).map((s) => (
          <SongCard key={s.id} s={s} />
        ))}
      </div>
    </div>
    </div>
  );
}
