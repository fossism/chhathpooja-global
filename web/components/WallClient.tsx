"use client";
import { useEffect, useState } from "react";

type Post = { id: string; city: string; country: string; text: string; likes: number; img?: string; pending?: boolean };

const SEED: Post[] = [
  { id: "seed-patna", city: "Patna", country: "India", text: "Collectorate ghat at sunrise — 5000 diyas!", likes: 214 },
  { id: "seed-edison", city: "Edison, NJ", country: "USA", text: "First Chhath abroad. Pond + home.", likes: 96 },
  { id: "seed-janakpur", city: "Janakpur", country: "Nepal", text: "Dhanush Sagar night kirtan.", likes: 187 },
  { id: "seed-london", city: "London", country: "UK", text: "Rooftop soop facing sunrise.", likes: 64 },
  { id: "seed-dubai", city: "Dubai", country: "UAE", text: "Community hall arghya — 40 families!", likes: 88 },
  { id: "seed-mumbai", city: "Mumbai", country: "India", text: "Juhu beach Sandhya Arghya crowd.", likes: 142 }
];

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"]
};
const MAX_CITY = 60;
const MAX_COUNTRY = 60;
const MAX_TEXT = 280;

function sanitizeInput(s: string, max: number): string {
  // Strip control chars, collapse whitespace, trim + hard length cap.
  // React escapes on render, this stops spam / control-char abuse at the source.
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function hasValidImageSignature(file: File): Promise<boolean> {
  try {
    const buf = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (buf.length < 4) return false;
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true; // PNG
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true; // GIF87a/89a
    if (
      buf.length >= 12 &&
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    )
      return true; // RIFF....WEBP
    return false;
  } catch {
    return false;
  }
}

export default function WallClient() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ city: "", country: "", text: "" });
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [pendingImg, setPendingImg] = useState<{ url: string; name: string } | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  // Revoke blob URL on unmount to avoid memory leak.
  useEffect(() => {
    return () => {
      if (pendingImg) URL.revokeObjectURL(pendingImg.url);
    };
  }, [pendingImg]);

  function clearPendingImg() {
    if (pendingImg) URL.revokeObjectURL(pendingImg.url);
    setPendingImg(null);
    setFileKey((k) => k + 1);
  }

  async function handleFile(file: File | undefined) {
    setImgError(null);
    if (!file) return;
    if (pendingImg) URL.revokeObjectURL(pendingImg.url);
    setPendingImg(null);

    if (!(file.type in ALLOWED_TYPES)) {
      setImgError("Only JPG, PNG, WEBP or GIF images are allowed.");
      setFileKey((k) => k + 1);
      return;
    }
    const lower = file.name.toLowerCase();
    const okExt = ALLOWED_TYPES[file.type].some((ext) => lower.endsWith(ext));
    if (!okExt) {
      setImgError("File extension does not match its image type.");
      setFileKey((k) => k + 1);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImgError("Image too large — max 3 MB.");
      setFileKey((k) => k + 1);
      return;
    }
    setChecking(true);
    try {
      const ok = await hasValidImageSignature(file);
      if (!ok) {
        setImgError("File is not a valid image (signature check failed).");
        setFileKey((k) => k + 1);
        return;
      }
      const url = URL.createObjectURL(file);
      setPendingImg({ url, name: file.name });
    } finally {
      setChecking(false);
    }
  }

  function handlePost() {
    setFormError(null);
    const city = sanitizeInput(form.city, MAX_CITY);
    const country = sanitizeInput(form.country || "India", MAX_COUNTRY);
    const text = sanitizeInput(form.text, MAX_TEXT);
    if (!city || !text) {
      setFormError("City and note are required (note max 280 chars).");
      return;
    }
    setPosts([
      { id: `local-${Date.now()}`, city, country, text, likes: 0, img: pendingImg?.url, pending: true },
      ...posts
    ]);
    setForm({ city: "", country: "", text: "" });
    // Keep the blob URL alive for the new post; reset picker state without revoking.
    setPendingImg(null);
    setFileKey((k) => k + 1);
  }

  const countries = ["All", ...Array.from(new Set(posts.map((p) => p.country)))];
  const shown = posts.filter((p) => filter === "All" || p.country === filter);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Global wall</h1>
        <p className="section-sub">Where are you doing Chhath from?</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 text-xs font-bold border ${filter === c ? "bg-teal text-cream border-teal" : "bg-cream border-line"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="card mt-3">
          <div className="grid md:grid-cols-3 gap-2">
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" maxLength={MAX_CITY} className="input" />
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" maxLength={MAX_COUNTRY} className="input" />
            <input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Your Chhath note…" maxLength={MAX_TEXT} className="input" />
          </div>
          {formError && <p role="alert" className="text-sm font-semibold text-red-700 mt-2">{formError}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <label className="btn btn-ghost text-sm cursor-pointer">
              {checking ? "Checking…" : pendingImg ? "Change photo" : "Upload photo"}
              <input
                key={fileKey}
                type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
            </label>
            {pendingImg && (
              <span className="chip">
                {pendingImg.name.slice(0, 24)}
                <button onClick={clearPendingImg} aria-label="Remove photo" className="ml-1 font-bold">✕</button>
              </span>
            )}
            <button
              className="btn btn-primary text-sm"
              disabled={checking}
              onClick={handlePost}
            >
              Post
            </button>
          </div>
          {imgError && <p role="alert" className="text-sm font-semibold text-red-700 mt-2">{imgError}</p>}
          <p className="text-xs text-teal/60 mt-2">Max 3 MB, JPG/PNG/WEBP/GIF only. Posts are local preview + marked awaiting review — no auto-publish.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {shown.map((p) => (
          <div key={p.id} className="card !p-4">
            {p.img
              ? <img src={p.img} alt={`Chhath photo from ${p.city}`} loading="lazy" className="h-36 w-full object-cover rounded-xl border border-line" />
              : <div className="h-28 rounded-xl bg-cream border border-line flex items-center justify-center text-4xl">☀️</div>}
            <p className="text-sm font-bold mt-2">📍 {p.city}, {p.country}</p>
            <p className="text-sm text-teal/70">{p.text}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  const isLiked = !!liked[p.id];
                  setLiked({ ...liked, [p.id]: !isLiked });
                  setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, likes: x.likes + (isLiked ? -1 : 1) } : x)));
                }}
                className="text-xs font-bold rounded-full border border-line bg-cream px-3 py-1"
              >
                {liked[p.id] ? "♥" : "♡"} {p.likes}
              </button>
              {p.pending && <span className="chip !py-0.5 !text-[11px]">Awaiting review</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
