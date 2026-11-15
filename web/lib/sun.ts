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

/**
 * NOAA Solar Calculation for offline Astronomical Sunrise and Sunset.
 * Accurate to ~1-2 minutes globally without external API dependencies.
 */
export function calculateAstronomicalTimes(lat: number, lon: number, dateISO: string): {
  sunrise: string;
  sunset: string;
} {
  const d = new Date(`${dateISO}T12:00:00Z`);
  const year = d.getUTCFullYear();
  const start = Date.UTC(year, 0, 0);
  const dayOfYear = Math.floor((d.getTime() - start) / 86400000);

  // Fractional year in radians
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

  // Equation of time in minutes
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination in radians
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const phi = (Math.max(-89.9, Math.min(89.9, lat)) * Math.PI) / 180;
  // Zenith for sunrise/sunset is 90.833° (accounts for refraction and solar disc diameter)
  const zenithRad = (90.833 * Math.PI) / 180;

  let cosOmega =
    (Math.cos(zenithRad) - Math.sin(phi) * Math.sin(decl)) /
    (Math.cos(phi) * Math.cos(decl));

  cosOmega = Math.max(-1, Math.min(1, cosOmega));
  const omegaDeg = (Math.acos(cosOmega) * 180) / Math.PI;

  const solarNoonUTC = 720 - 4 * lon - eqtime;
  const sunriseUTC = solarNoonUTC - 4 * omegaDeg;
  const sunsetUTC = solarNoonUTC + 4 * omegaDeg;

  // Approximate local standard timezone from longitude
  const tzOffsetHours = Math.round((lon / 15) * 2) / 2;
  const tzOffsetMinutes = tzOffsetHours * 60;

  const toHHMM = (utcMinutes: number): string => {
    let localMin = Math.round(utcMinutes + tzOffsetMinutes);
    localMin = ((localMin % 1440) + 1440) % 1440;
    const h = Math.floor(localMin / 60);
    const m = localMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return {
    sunrise: toHHMM(sunriseUTC),
    sunset: toHHMM(sunsetUTC)
  };
}
