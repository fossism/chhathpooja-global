import { Metadata } from "next";
import PrasadClient from "../../../components/PrasadClient";

export const metadata: Metadata = {
  title: "Prasad Seva & Thekua Distribution Points — Chhath Mahaparv",
  description: "City-wise Chhath Mahaprasad distribution points connecting fasting families with soldiers on border duty, hostel students, night-shift engineers, and migrant workers away from home."
};

export default function PrasadPage() {
  return (
    <div className="shell py-8 md:py-12">
      <PrasadClient />
    </div>
  );
}
