"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getGhats } from "../lib/chhath";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function GhatMap() {
  const ghats = getGhats();
  const [mapActivated, setMapActivated] = useState(false);

  useEffect(() => {
    if (!mapActivated) return;
    // Self-hosted marker icons (public/leaflet/) — no unpkg.com CDN, so no
    // third-party JS/image supply-chain + no extra tracker. Matches CSP img-src.
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png"
    });
  }, [mapActivated]);

  return (
    <div className="card !p-2 overflow-hidden">
      {!mapActivated ? (
        <div className="relative h-[360px] w-full rounded-xl bg-gradient-to-br from-teal/10 via-cream to-mustard/15 border border-line flex flex-col items-center justify-center p-6 text-center shadow-inner">
          <div className="w-14 h-14 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center text-3xl mb-3 shadow-sm">
            🗺️
          </div>
          <h3 className="font-bold text-lg text-teal">Interactive Ghat Map</h3>
          <p className="text-xs sm:text-sm text-teal/70 max-w-md mt-1 leading-relaxed">
            Privacy shield: Loading map tiles sends requests to external OpenStreetMap servers.
            Click below to load the live map with {ghats.length} verified sacred ghats.
          </p>
          <button
            type="button"
            onClick={() => setMapActivated(true)}
            className="btn btn-primary mt-4 text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Load Interactive Map</span>
            <span>✦</span>
          </button>
          <span className="text-[11px] text-teal/50 font-mono mt-3">
            OpenStreetMap • Verified Coordinates
          </span>
        </div>
      ) : (
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
      )}
      <p className="text-xs text-teal/60 mt-2 px-1">
        Map tiles © OpenStreetMap contributors — loading the map sends your IP to the tile server.
        Markers work offline from bundled open data once loaded.
      </p>
    </div>
  );
}
