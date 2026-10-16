import raw from "../../data/playlist.json";

export type Track = {
  uid: string; title: string; artist: string; album: string;
  kind: "youtube" | "tts"; youtubeId?: string;
  lyric?: string; meaning?: string; thumb?: string;
};
export type AlbumT = { id: string; title: string; subtitle: string; tracks: Track[] };

type RawTrack = { id: string; title: string; artist: string; youtubeId?: string; lyric?: string; meaning?: string };
type RawAlbum = { id: string; title: string; subtitle: string; tracks: RawTrack[] };

// Plain module (no "use client") so server pages can count/render statically
// while client components use the same track list for playback.
export const ALBUMS: AlbumT[] = (raw as { albums: RawAlbum[] }).albums.map((a) => ({
  id: a.id, title: a.title, subtitle: a.subtitle,
  tracks: a.tracks.map((t) => ({
    uid: `${a.id}:${t.id}`,
    title: t.title, artist: t.artist, album: a.title,
    kind: t.youtubeId ? "youtube" : "tts",
    youtubeId: t.youtubeId, lyric: t.lyric, meaning: t.meaning,
    thumb: t.youtubeId ? `https://i.ytimg.com/vi/${t.youtubeId}/hqdefault.jpg` : undefined
  }))
}));

export const ALL_TRACKS: Track[] = ALBUMS.flatMap((a) => a.tracks);
