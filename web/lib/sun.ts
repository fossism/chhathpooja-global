// Tiny solar math: sunset direction for any ghat, no API needed.
// At the horizon, sunrise/sunset azimuth depends only on latitude + solar
// declination — so "which way do I face for Sandhya Arghya?" is answerable
// offline. Accuracy ~±2°, plenty for finding the sun over a river.

export function solarDeclination(dateISO: string): number {
  // δ = -23.44° · cos(360/365 · (N+10)), N = day of year
  const d = new Date(`${dateISO}T00:00:00Z`);
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const n = Math.floor((d.getTime() - start) / 86400000);
  return -23.44 * Math.cos(((360 / 365) * (n + 10) * Math.PI) / 180);
}

export function sunsetAzimuth(lat: number, dateISO: string): { azimuth: number; label: string } {
  const phi = (Math.max(-66, Math.min(66, lat)) * Math.PI) / 180;
  const delta = (solarDeclination(dateISO) * Math.PI) / 180;
  const cosA = Math.max(-1, Math.min(1, Math.sin(delta) / Math.cos(phi)));
  const sunriseAz = (Math.acos(cosA) * 180) / Math.PI; // from north, morning side
  const azimuth = Math.round((360 - sunriseAz) * 10) / 10; // mirror to evening side
  return { azimuth, label: compass16(azimuth) };
}

export function compass16(deg: number): string {
  const pts = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return pts[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}
