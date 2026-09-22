"use client";
import { useState } from "react";

type Post = { city: string; country: string; text: string; likes: number; img?: string };

const SEED: Post[] = [
  { city: "Patna", country: "India", text: "Collectorate ghat at sunrise — 5000 diyas!", likes: 214 },
  { city: "Edison, NJ", country: "USA", text: "First Chhath abroad. Pond + home.", likes: 96 },
  { city: "Janakpur", country: "Nepal", text: "Dhanush Sagar night kirtan.", likes: 187 },
  { city: "London", country: "UK", text: "Rooftop soop facing sunrise.", likes: 64 },
  { city: "Dubai", country: "UAE", text: "Community hall arghya — 40 families!", likes: 88 },
  { city: "Mumbai", country: "India", text: "Juhu beach Sandhya Arghya crowd.", likes: 142 }
];

export default function WallClient() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ city: "", country: "", text: "" });
  const [liked, setLiked] = useState<Record<number, boolean>>({});

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
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="input" />
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="input" />
            <input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Your Chhath note…" className="input" />
          </div>
          <div className="flex gap-2 mt-2">
            <label className="btn btn-ghost text-sm cursor-pointer">
              Upload photo
              <input
                type="file" accept="image/*" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) (window as any).__wallImg = URL.createObjectURL(f);
                }}
              />
            </label>
            <button
              className="btn btn-primary text-sm"
              onClick={() => {
                if (!form.city || !form.text) return;
                const img = (window as any).__wallImg as string | undefined;
                setPosts([{ city: form.city, country: form.country || "India", text: form.text, likes: 0, img }, ...posts]);
                setForm({ city: "", country: "", text: "" });
                (window as any).__wallImg = undefined;
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {shown.map((p, i) => (
          <div key={`${p.city}-${i}`} className="card !p-4">
            {p.img
              ? <img src={p.img} alt="" className="h-36 w-full object-cover rounded-xl border border-line" />
              : <div className="h-28 rounded-xl bg-cream border border-line flex items-center justify-center text-4xl">☀️</div>}
            <p className="text-sm font-bold mt-2">📍 {p.city}, {p.country}</p>
            <p className="text-sm text-teal/70">{p.text}</p>
            <button
              onClick={() => {
                setLiked({ ...liked, [i]: !liked[i] });
                setPosts(posts.map((x, j) => (i === j ? { ...x, likes: x.likes + (liked[i] ? -1 : 1) } : x)));
              }}
              className="text-xs font-bold mt-2 rounded-full border border-line bg-cream px-3 py-1"
            >
              {liked[i] ? "♥" : "♡"} {p.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
