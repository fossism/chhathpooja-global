# Contributing to ChhathMahaparv

## Ways to contribute (no code needed)
1. **Translate:** edit `messages/{en,hi,bho,mai,ne}.json`
2. **Add a ghat:** edit `data/ghats.json` — fields: name, city, country, lat, lng, riverOrPond, parking, lighting, policeHelp, firstAid. Do NOT add toilet / food-stall info.
3. **Add a song:** edit `data/songs.json` with lyrics + meaning + singer credit.
4. **Fix dates:** edit `data/chhath-dates-2025-2035.json` with Panchang source link.

## Code contributions
- `cd web && npm install && npm run dev`
- Branch: `feat/<short-name>` from `main`
- PR must pass `npm run lint && npm run build`
- Keep first load < 200kb, mobile-first, Hindi font legible.

## Ghat data rules
Allowed facilities ONLY: `parking, lighting, policeHelp, firstAid, drinkingWater`.
Forbidden: toilet details, food stalls/canteens, cleanliness/eco plastic scores (removed in v1).

## Moderation
Wall photos + new ghats need maintainer approval via Supabase `moderated` flag.

## Code of Conduct
Be respectful. Chhath is sacred — no memes mocking rituals. See `CODE_OF_CONDUCT.md`.
