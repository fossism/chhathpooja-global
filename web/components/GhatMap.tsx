"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getGhats } from "../lib/chhath";
import { useEffect } from "react";
import L from "leaflet";

export default function GhatMap() {
  const ghats = getGhats();
  useEffect(() => {
    // fix default marker icons for Next.js
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });
  }, []);
  return (
    <div className="card !p-2">
      <MapContainer center={[25.6, 85.1]} zoom={4} style={{ height: 360, borderRadius: 12 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        {ghats.map((g) => (
          <Marker key={g.id} position={[g.lat, g.lng]}>
            <Popup><b>{g.name}</b><br />{g.city}, {g.country}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
