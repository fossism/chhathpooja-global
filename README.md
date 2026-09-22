# ChhathMahaparv.org — Global Open-Source Hub for Chhath Puja

MIT-licensed, community-owned platform for Chhath Mahaparv worldwide.

> No toilet / food-stall info at ghats (by design). No eco-score module in v1.

## Vision
Make Chhath accessible from Patna to New Jersey: exact dates, city-wise Arghya time, vidhi guide, ghat finder, global wall.

## Monorepo
```
./web/        Next.js 14 + TS + Tailwind + next-intl + Leaflet
./data/       Open data: dates, ghats, songs, samagri
./messages/   i18n strings: en, hi, bho, mai, ne
./supabase/   Postgres schema + storage
./docs/       Panchang sources, philosophy
.github/      Issue + PR templates
```

## Quick start
```bash
cd web
npm install
npm run dev
# open http://localhost:3000/en
```

## Dates source
`data/chhath-dates-2025-2035.json` — manually verified from DrikPanchang each year.
Never auto-calculate Kartik Shashthi astronomically.

## Arghya time
`GET /api/arghya?lat=25.6&lon=85.1&date=2026-11-15` proxies Open-Meteo (no key).
Fallback: Patna time + disclaimer.

## Contributing
See `CONTRIBUTING.md`. Content-only contributions welcome (translate JSON, add ghat/song).

## License
MIT — see `LICENSE`.
