"use client";

import dynamic from "next/dynamic";

export const Chhath3DView = dynamic(() => import("./Chhath3DView"), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-2xl bg-teal/10 animate-pulse flex items-center justify-center text-teal/60 text-sm font-semibold border border-line">
      Loading 3D Ghat Experience…
    </div>
  )
});

export default Chhath3DView;
