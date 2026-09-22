"use client";
import { useState } from "react";

export default function Kids() {
  const [quiz, setQuiz] = useState<Record<number, string>>({});
  const qs = [
    { q: "When is Sandhya Arghya?", opts: ["Sunrise", "Sunset"], ans: "Sunset" },
    { q: "Who is Chhathi Maiya?", opts: ["Surya's sister, protector", "River goddess only"], ans: "Surya's sister, protector" },
    { q: "How many days is Chhath?", opts: ["2", "4"], ans: "4" }
  ];
  const score = qs.filter((x, i) => quiz[i] === x.ans).length;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Kids mode</h1>
        <p className="section-sub">A 2-minute story + quiz.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-bold text-lg">The story</h2>
          <p className="text-sm text-teal/70 mt-1">People thank the Sun — for rice, light, life. Chhathi Maiya protects family. For 4 days we clean, fast, sing, and offer water and fruits to the setting and rising sun. Everyone shares prasad!</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-lg">Quiz — {score}/{qs.length}</h2>
          {qs.map((x, i) => (
            <div key={i} className="mt-2 rounded-xl border border-line p-3">
              <p className="text-sm font-bold">{x.q}</p>
              <div className="flex gap-2 mt-2">
                {x.opts.map((o) => (
                  <button
                    key={o}
                    onClick={() => setQuiz({ ...quiz, [i]: o })}
                    className={`text-xs font-bold rounded-full px-3 py-1.5 border ${quiz[i] === o ? (o === x.ans ? "bg-mustard border-teal" : "bg-cream border-teal line-through" ) : "bg-cream border-line"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {score === 3 && <p className="text-sm font-bold mt-2 text-teal">Chhath champion!</p>}
        </div>
      </div>
    </div>
  );
}
