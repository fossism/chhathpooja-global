import AskBox from "../../../components/AskBox";

export default function Ask() {
  return (
    <div className="shell py-10">
      <h1 className="section-title">Chhath Sahayak</h1>
      <p className="section-sub">Offline guide — dates, vidhi, samagri, songs, ghats. No login, no AI key.</p>
      <div className="mt-4">
        <AskBox />
      </div>
    </div>
  );
}
