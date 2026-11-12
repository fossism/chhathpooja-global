import WallClient from "../../../components/WallClient";
import SamagriWall from "../../../components/SamagriWall";

export default function Wall() {
  return (
    <div className="shell py-10 space-y-12">
      {/* Community Photo & Moment Stream */}
      <WallClient />

      {/* Complete Chhath Puja Samagri List with Images (News18 Complete Checklist) */}
      <div id="samagri-checklist" className="border-t border-line/80 pt-8 scroll-mt-20">
        <SamagriWall />
      </div>
    </div>
  );
}
