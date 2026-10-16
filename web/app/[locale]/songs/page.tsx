import AlbumView from "../../../components/AlbumView";
import { ALBUMS } from "../../../lib/playlist";
import SongCard from "../../../components/SongCard";
import songs from "../../../../data/songs.json";

const totalTracks = ALBUMS.reduce((n, a) => n + a.tracks.length, 0);

export default function Songs() {
  return (
    <div className="shell py-10 pb-28">
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Folk archive + albums</h1>
        <p className="section-sub">
          {ALBUMS.length} albums • {totalTracks} tracks — classics, jukeboxes and folk listen-aloud.
          Press play: music keeps going while you browse, with shuffle, repeat and queue.
        </p>
        <p className="text-xs text-teal/60 mt-1">Videos stream from the artists' official YouTube channels. Jukebox videos hold 8–10 songs each.</p>
      </div>
      <AlbumView />
      <div>
        <h2 className="font-bold text-lg mt-2">Lyrics book</h2>
        <p className="section-sub">Read the words behind the songs, with singer credit. Community licensed.</p>
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
