"use client";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  city: string;
  country: string;
  text: string;
  likes: number;
  img?: string;
  pending?: boolean;
};

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
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true; // GIF
    if (
      buf.length >= 12 &&
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    )
      return true; // WEBP
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
  const [pendingImg, setPendingImg] = useState<{ dataUrl: string; name: string } | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Load user posts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chhath_wall_user_posts");
      if (saved) {
        const parsed: Post[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts([...parsed, ...SEED]);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  function clearPendingImg() {
    setPendingImg(null);
    setFileKey((k) => k + 1);
  }

  async function handleFile(file: File | undefined) {
    setImgError(null);
    if (!file) return;
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
      // Read as Data URL so it can persist in localStorage
      const reader = new FileReader();
      reader.onload = () => {
        setPendingImg({ dataUrl: reader.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
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

    const newPost: Post = {
      id: `local-${Date.now()}`,
      city,
      country,
      text,
      likes: 0,
      img: pendingImg?.dataUrl,
      pending: true
    };

    const updated = [newPost, ...posts];
    setPosts(updated);

    // Save only user's local posts to localStorage
    try {
      const existingUserPosts: Post[] = JSON.parse(localStorage.getItem("chhath_wall_user_posts") || "[]");
      localStorage.setItem("chhath_wall_user_posts", JSON.stringify([newPost, ...existingUserPosts]));
    } catch {
      // localStorage quota or private mode fallback
    }

    setForm({ city: "", country: "", text: "" });
    setPendingImg(null);
    setFileKey((k) => k + 1);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 8000);
  }

  const countries = ["All", ...Array.from(new Set(posts.map((p) => p.country)))];
  const shown = posts.filter((p) => filter === "All" || p.country === filter);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <span className="marker">Community Showcase</span>
        <h1 className="section-title mt-2">Global Chhath Wall</h1>
        <p className="section-sub mt-1">
          Share your family&apos;s Chhath ghat memories, soop decorations, and sunrise photos from anywhere in the world.
        </p>

        {/* Verification System Notice Bar */}
        <div className="mt-4 p-3.5 rounded-xl bg-mustard/15 border border-mustard/40 flex items-start gap-3 text-xs text-teal">
          <span className="text-lg shrink-0">🛡️</span>
          <div className="leading-relaxed">
            <span className="font-bold block">Community Pavitrata & Verification Policy:</span>
            To maintain the sacred sanctity of Chhath Mahaparv, all new photo submissions are screened for quality and appropriateness before being broadcast globally. When you post, you will immediately see a local preview with an <strong>&ldquo;Awaiting review&rdquo;</strong> badge.
            <button
              onClick={() => setShowReviewModal(true)}
              className="ml-1.5 underline font-bold hover:text-mustard inline-block"
            >
              How verification works →
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 text-xs font-bold border transition ${
                filter === c ? "bg-teal text-cream border-teal shadow-sm" : "bg-cream border-line text-teal/80 hover:bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Post Creation Box */}
        <div className="card mt-4 border-mustard/40 bg-white">
          <h2 className="text-sm font-bold text-teal mb-2">Share your Chhath Ghat or Home Vrat:</h2>
          <div className="grid md:grid-cols-3 gap-2">
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="City (e.g. Patna, Edison NJ, London)"
              maxLength={MAX_CITY}
              className="input"
            />
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Country (defaults to India)"
              maxLength={MAX_COUNTRY}
              className="input"
            />
            <input
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Your sacred moment or prayer…"
              maxLength={MAX_TEXT}
              className="input"
            />
          </div>

          {formError && (
            <p role="alert" className="text-sm font-semibold text-red-700 mt-2">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <label className="btn btn-ghost text-xs cursor-pointer !py-2 !px-3 border-teal/30">
              {checking ? "Checking…" : pendingImg ? "📷 Change Photo" : "📷 Upload Photo"}
              <input
                key={fileKey}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
            </label>
            {pendingImg && (
              <span className="chip text-xs bg-mustard/20 border-mustard/40">
                {pendingImg.name.slice(0, 24)}
                <button
                  onClick={clearPendingImg}
                  aria-label="Remove photo"
                  className="ml-1.5 font-bold hover:text-red-700"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              className="btn btn-primary text-xs !py-2 !px-5 ml-auto"
              disabled={checking}
              onClick={handlePost}
            >
              Post to Wall
            </button>
          </div>

          {imgError && (
            <p role="alert" className="text-sm font-semibold text-red-700 mt-2">
              {imgError}
            </p>
          )}

          {justSubmitted && (
            <div className="mt-3 p-3 bg-teal/10 border border-teal/30 rounded-xl text-xs text-teal animate-fadeIn">
              ✅ <strong>Submitted successfully!</strong> Your post is now visible on your device with an <strong>&ldquo;Awaiting review&rdquo;</strong> tag and has been queued for verification.
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {shown.map((p) => (
          <div key={p.id} className="card !p-4 bg-white flex flex-col justify-between hover:shadow-md transition">
            <div>
              {p.img ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-line bg-teal/5">
                  <img
                    src={p.img}
                    alt={`Chhath photo from ${p.city}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {p.pending && (
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="chip bg-mustard text-teal font-extrabold text-[10px] shadow-sm hover:scale-105 transition"
                      >
                        ⏳ Awaiting review
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-32 rounded-xl bg-gradient-to-br from-mustard/20 to-teal/10 border border-line flex items-center justify-center text-4xl">
                  ☀️
                </div>
              )}

              <div className="mt-3">
                <p className="text-sm font-bold text-teal flex items-center gap-1">
                  <span>📍</span>
                  <span>{p.city}, {p.country}</span>
                </p>
                <p className="text-xs text-teal/80 mt-1 leading-relaxed">{p.text}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-line/60">
              <button
                onClick={() => {
                  const isLiked = !!liked[p.id];
                  setLiked({ ...liked, [p.id]: !isLiked });
                  setPosts((prev) =>
                    prev.map((x) => (x.id === p.id ? { ...x, likes: x.likes + (isLiked ? -1 : 1) } : x))
                  );
                }}
                className={`text-xs font-bold rounded-full border px-3 py-1 transition flex items-center gap-1.5 ${
                  liked[p.id] ? "bg-teal text-cream border-teal" : "bg-cream border-line text-teal hover:border-teal/50"
                }`}
              >
                <span>{liked[p.id] ? "❤️" : "🤍"}</span>
                <span>{p.likes}</span>
              </button>

              {p.pending && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-[10px] text-teal/70 hover:underline font-medium"
                >
                  Why is it verifying?
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Moderation Explanation Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-line space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-lg text-teal flex items-center gap-2">
                <span>🛡️</span>
                <span>How Wall Verification Works</span>
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-teal/60 hover:text-teal font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-teal/80 leading-relaxed">
              <p>
                <strong>1. Why is verification necessary?</strong><br />
                Chhath Mahaparv is observed with sacred purity (<em>Pavitrata</em>). Because this website is open to everyone globally without mandatory logins, an unmoderated upload queue would allow spammers or malicious bots to deface the holy wall with inappropriate images.
              </p>
              <p>
                <strong>2. What does &ldquo;Awaiting review&rdquo; mean?</strong><br />
                When you post a photo, your browser saves your photo locally and marks it <strong>Awaiting review</strong>. You will always see your own photo on your phone or computer.
              </p>
              <p>
                <strong>3. How does it become public globally?</strong><br />
                When connected to the project&apos;s Supabase database (configured with <code>supabase/schema.sql</code>), submissions sit in the <code>photos</code> table with <code>moderated = false</code>. A volunteer community moderator checks the image to verify it is an authentic Chhath celebration, then approves it (<code>moderated = true</code>). Once approved, it appears live to millions of devotees worldwide!
              </p>
            </div>

            <div className="pt-2 border-t border-line flex justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="btn btn-primary !py-2 !px-5 text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
