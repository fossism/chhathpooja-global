import Link from "next/link";
import WallClient from "../../../components/WallClient";
import SamagriWall from "../../../components/SamagriWall";

export default function Wall({ params }: { params: { locale: string } }) {
  return (
    <div className="shell py-10 space-y-12">
      {/* Community Prasad Sharing Notice */}
      <div className="card bg-gradient-to-r from-amber-50 via-cream to-amber-50 border-mustard/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="chip chip-yellow text-[10px] font-bold">Community Initiative</span>
          <h2 className="font-extrabold text-base text-teal mt-1">Prasad Seva &bull; Thekua Sharing Network</h2>
          <p className="text-xs text-teal/75 mt-0.5 max-w-xl">
            Missing home prasad in your city, or fasting and have extra Thekua to share with students? Connect on our zero-cost board.
          </p>
        </div>
        <Link href={`/${params.locale}/prasad`} className="btn btn-primary text-xs !py-2 !px-4 shrink-0 font-bold">
          Open Prasad Board →
        </Link>
      </div>

      {/* Community Photo & Moment Stream */}
      <WallClient />

      {/* Complete Chhath Puja Samagri List with Images (News18 Complete Checklist) */}
      <div id="samagri-checklist" className="border-t border-line/80 pt-8 scroll-mt-20">
        <SamagriWall />
      </div>
    </div>
  );
}
