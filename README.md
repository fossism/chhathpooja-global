# ChhathMahaparv.org — a free home for Chhath Puja on the internet

Chhath is a 4-day festival where people thank the Sun god and Chhathi Maiya.
Families clean their homes, fast, cook prasad like thekua, sing folk songs,
and offer water and fruits to the setting sun and the rising sun at a river
or pond (called a ghat).

This website puts everything a family needs for Chhath in one place,
in 5 languages (English, Hindi, Bhojpuri, Maithili, Nepali).
It is free, open-source (MIT), and owned by the community — anyone can help.

> By choice, this site never lists toilets or food stalls at ghats.

## What it does

- **Dates you can trust** — Kartik + Chaiti Chhath dates 2025–2030, checked
  by humans from DrikPanchang every year. Never guessed by computer.
- **Arghya time for your city** — sunset (Sandhya) and sunrise (Usha) time
  for Patna, Delhi, Mumbai, Kolkata, Janakpur, Kathmandu, Edison NJ, London,
  Dubai — or your own location. Plus a small compass that shows which way
  to face the setting sun.
- **Vidhi guide** — the 4 days (Nahay-Khay, Kharna, Sandhya Arghya,
  Usha Arghya + Parana) as a tick-off checklist that stays saved on your
  phone, even with no internet at the ghat.
- **Ghat finder** — a map of Chhath ghats around the world, with facilities
  like parking, lighting and first aid. You can submit your own ghat;
  a moderator checks it before it goes public.
- **Global wall** — photos and notes from people celebrating Chhath
  everywhere, from Patna to London.
- **Folk songs** — lyrics with meanings (like *Kellwa Ke Paat Par*),
  with a Listen button that reads them aloud.
- **Chhath Sahayak** — a small offline helper that answers common questions
  (dates, vidhi, samagri, songs, ghats) with no login and no AI key.
- **Kids mode** — a 2-minute story of Chhath plus a fun quiz.
- **Calendar download** — add all Chhath dates to your phone calendar
  in one tap (.ics file).

## Why it exists

Chhath families are now everywhere — Bihar, Nepal, Delhi, Mumbai,
Dubai, London, New Jersey. But information is scattered: dates on one site,
sunset time on another, songs only in memory, ghat details by word of mouth.
Elders know everything, but young people living far from home often don't
know when to fast, what to pack, or where to gather.

This site exists so that:

1. A student in London can find her city's Arghya time in 10 seconds.
2. A first-time vrati knows exactly what to do on each of the 4 days.
3. A family in Edison can pin their pond so others can join.
4. Nani's songs are written down, translated, and never lost.
5. Everything keeps working in 5 languages, on cheap phones,
   even with no signal at the riverbank.

No ads. No accounts. No fees. Just the festival, done right.

## What's inside (for builders)

```
./web/        the website (Next.js 14 + TypeScript + Tailwind)
./data/       open data: dates, ghats, songs, samagri (JSON)
./messages/   translations: en, hi, bho, mai, ne
./supabase/   database rules (Postgres + photo storage)
./docs/       where dates come from, festival background
.github/      issue + PR templates, automatic build check
```

## Run it yourself

```bash
cd web
npm install
npm run dev
# open http://localhost:3000/en
```

## Where do the dates come from?

`data/chhath-dates-2025-2035.json` — a human checks DrikPanchang each year
and writes the real dates. The site never calculates festival dates by
itself, because getting a fast wrong would be worse than useless.

Sunrise/sunset times come from Open-Meteo (free, no key). Far-future dates
have no forecast yet, so the site shows a Patna estimate with a clear
"estimate" warning instead of pretending.

## Help out

See `CONTRIBUTING.md`. You don't need to know coding:

- translate one line,
- add your city's ghat,
- add a song your grandmother sang.

## License

MIT — see `LICENSE`. This belongs to everyone.
