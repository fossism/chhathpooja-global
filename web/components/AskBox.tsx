"use client";
import { useState } from "react";
import { askSahayak, type Answer } from "../lib/sahayak";

const QUICK = ["When is next Chhath?", "Kharna me kya hota hai?", "What samagri do I need?", "Which song for Sandhya Arghya?"];

export default function AskBox() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState<Answer | null>(null);

  function submit(text: string) {
    const t = text.trim().slice(0, 500);
    if (!t) return;
    setQ(t);
    setAns(askSahayak(t));
  }

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const v = (e.currentTarget.querySelector("input")?.value ?? "");
          submit(v);
        }}
      >
        <input
          className="input"
          placeholder="Chhath ke baare me puchhein… e.g. When is next Chhath?"
          maxLength={500}
          aria-label="Ask about Chhath"
          defaultValue={q}
          key={ans ? "a" : "b"}
        />
        <button className="btn btn-primary shrink-0" type="submit">Ask</button>
      </form>
      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK.map((x) => (
          <button key={x} onClick={() => submit(x)} className="chip hover:bg-mustard/30">{x}</button>
        ))}
      </div>
      {ans && (
        <div className="card mt-4">
          <p className="text-sm font-medium whitespace-pre-line">{ans.text}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ans.sources.map((s) => (
              <span key={s} className="chip !text-[11px]">📚 {s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {ans.followUp.map((f) => (
              <button key={f} onClick={() => submit(f)} className="btn btn-ghost !py-1.5 !px-4 text-xs">{f} →</button>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-teal/60 mt-3">Offline Sahayak — answers from bundled open data, no AI key needed. Dates from DrikPanchang-verified JSON. Health/family-rule questions always defer to elders + doctor.</p>
    </div>
  );
}
