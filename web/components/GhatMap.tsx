"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getGhats } from "../lib/chhath";
import { useEffect } from "react";
import L from "leaflet";

export default function GhatMap() {
  const ghats = getGhats();
  useEffect(() => {
    // Self-hosted marker icons (public/leaflet/) — no unpkg.com CDN, so no
    // third-party JS/image supply-chain + no extra tracker. Matches CSP img-src.
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png"
    });
  }, []);
  return (
    <div className="card !p-2">
      <MapContainer center={[25.6, 85.1]} zoom={4} style={{ height: 360, borderRadius: 12 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        {ghats.map((g) => (
          <Marker key={g.id} position={[g.lat, g.lng]}>
            <Popup><b>{g.name}</b><br />{g.city}, {g.country}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="text-xs text-teal/60 mt-2 px-1">
        Map tiles © OpenStreetMap contributors — loading the map sends your IP to the tile server.
        Markers work offline from bundled open data once the page is cached.
      </p>
    </div>
  );
}
