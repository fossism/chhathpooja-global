import raw from "../../data/playlist.json";

export type Track = {
  uid: string;
  id: string;
  title: string;
  titleDevanagari?: string;
  artist: string;
  album?: string;
  category: string;
  kind: "youtube" | "tts";
  youtubeId?: string;
  lyric?: string;
  meaning?: string;
  thumb?: string;
};

export type AlbumT = {
  id: string;
  title: string;
  subtitle: string;
  cover?: string;
  tracks: Track[];
};

type RawSong = {
  id: string;
  title: string;
  titleDevanagari?: string;
  artist: string;
  category: string;
  youtubeId?: string;
  lyric?: string;
  meaning?: string;
};

const rawData = raw as any;

const rawSongs: RawSong[] = Array.isArray(rawData?.songs)
  ? rawData.songs
  : Array.isArray(rawData?.albums)
  ? rawData.albums.flatMap((a: any) =>
      (a.tracks || []).map((t: any) => ({
        ...t,
        category: a.title
      }))
    )
  : [];

export const ALL_TRACKS: Track[] = rawSongs.map((s) => ({
  uid: s.id,
  id: s.id,
  title: s.title,
  titleDevanagari: s.titleDevanagari,
  artist: s.artist,
  album: s.category || "Folk",
  category: s.category || "Folk",
  kind: s.youtubeId ? "youtube" : "tts",
  youtubeId: s.youtubeId,
  lyric: s.lyric,
  meaning: s.meaning,
  thumb: s.youtubeId
    ? `https://i.ytimg.com/vi/${s.youtubeId}/hqdefault.jpg`
    : undefined
}));

export const ALBUMS: AlbumT[] = Array.from(
  new Set(ALL_TRACKS.map((t) => t.category))
).map((cat) => {
  const tracks = ALL_TRACKS.filter((t) => t.category === cat);
  return {
    id: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: cat,
    subtitle: `${tracks.length} songs • pure Chhath devotion`,
    cover: tracks.find((t) => t.thumb)?.thumb,
    tracks
  };
});
