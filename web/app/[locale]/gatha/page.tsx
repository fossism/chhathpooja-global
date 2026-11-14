import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import gathaData from "../../../../data/gatha.json";
import GathaProgress from "../../../components/GathaProgress";
import { locales } from "../../../i18n";

const BASE = "https://chhathmahaparv.org";

const TITLE = "Chhath Gatha — the story behind Bihar's Chhath";
const DESCRIPTION =
  "Why Bihar offers the first arghya to the setting sun: Karna of Anga, Draupadi, Sita, Chhathi Maiya, and the river-and-harvest roots of Chhath.";
const HERO_ALT =
  "Devotees gathered at a green riverside ghat on a misty Chhath morning, with offerings and a canopy behind them.";

type ChapterImage = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
};

type StoryPlate = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  titleHi: string;
  imageAspect: "square" | "portrait" | "landscape";
  image: ChapterImage;
  body: string[];
};

type Chapter = StoryPlate & {
  note: string;
  inset?: {
    src: string;
    alt: string;
    caption: string;
  };
};

type Fact = { label: string; value: string; text: string };

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  span?: "wide" | "tall";
};

type Source = { title: string; url: string; note: string };

type Credit = {
  title: string;
  artist: string;
  license: string;
  licenseUrl: string;
  page: string;
};

const meta = gathaData.meta;
const intro = gathaData.intro;
const facts = gathaData.facts as Fact[];
const chapters = gathaData.chapters as Chapter[];
const epilogue = gathaData.epilogue as StoryPlate;
const gallery = gathaData.gallery as GalleryItem[];
const sources = gathaData.sources as Source[];
const credits = gathaData.credits as Credit[];

const ASPECT_CLASS: Record<Chapter["imageAspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]"
};

const indexItems = [
  ...chapters.map((c) => ({ id: c.id, number: c.number, title: c.title })),
  { id: epilogue.id, number: epilogue.number, title: epilogue.title }
];

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const url = `${BASE}/${params.locale}/gatha`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE}/${l}/gatha`])
      )
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: "Chhath Mahaparv",
      type: "article",
      images: [
        {
          url: `${BASE}/images/gatha/hero-sunrise.jpg`,
          width: 2200,
          height: 1238,
          alt: HERO_ALT
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [`${BASE}/images/gatha/hero-sunrise.jpg`]
    }
  };
}

export default function GathaPage({
  params
}: {
  params: { locale: string };
}) {
  return (
    <div>
      <GathaProgress />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#062420] text-cream">
        <Image
          src="/images/gatha/hero-sunrise.jpg"
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062420]/95 via-[#0b3a34]/80 to-[#0b3a34]/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#062420]/85 via-[#062420]/20 to-transparent" />

        <div className="shell relative flex min-h-[70vh] flex-col justify-center py-24 md:min-h-[78vh] md:py-32">
          <div className="max-w-3xl">
            <span className="marker marker--on-dark">
              <span className="marker-rule" />
              {intro.marker}
            </span>

            <h1 className="headline headline--on-dark mt-5 text-4xl leading-[1.03] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Why we stand in the
              <br className="hidden sm:block" /> river at{" "}
              <em className="text-mustard">dusk</em>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base md:text-lg">
              {intro.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              {[meta.plates, meta.regions].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-cream/25 bg-cream/10 px-3 py-1 font-medium text-cream/85 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#surya" className="btn btn-accent">
                Read the story
              </a>
              <Link
                href={`/${params.locale}/vidhi`}
                className="btn border border-cream/40 bg-transparent text-cream hover:bg-cream/10"
              >
                Walk the four days
              </Link>
            </div>
          </div>

          {/* Sun seal — desktop only */}
          <div className="absolute bottom-10 right-4 hidden lg:block md:right-6">
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-mustard shadow-[0_0_60px_rgba(232,184,75,0.35)]">
              <Image
                src={chapters[0].image.src}
                alt={chapters[0].image.alt}
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro + facts + contents */}
      <section className="band">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <span className="marker">
                <span className="marker-rule" />
                Before the first arghya
              </span>
              <h2 className="headline mt-4 text-3xl leading-[1.12] md:text-4xl">
                {intro.title}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-teal/80 md:text-base">
                {intro.paragraph}
              </p>
              <p className="mt-6 border-l-2 border-mustard pl-4 text-xs leading-relaxed text-teal/65 md:text-sm">
                {meta.note}
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="divide-y divide-line border-y border-line">
                {facts.map((fact, i) => (
                  <div key={fact.label} className="flex gap-5 py-5">
                    <span className="pt-0.5 font-mono text-[11px] text-mustard">
                      {`0${i + 1}`}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal/50">
                        {fact.label}
                      </p>
                      <p className="mt-1 font-serif text-2xl leading-tight text-teal md:text-3xl">
                        {fact.value}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-teal/70 md:text-sm">
                        {fact.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <nav aria-label="Gatha chapters" className="mt-12 md:mt-16">
            <div className="flex items-baseline justify-between gap-4 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-teal/45">
                Contents
              </span>
              <span className="font-mono text-[10px] text-teal/45">
                {meta.plates}
              </span>
            </div>
            <ol className="flex snap-x overflow-x-auto border-y border-line">
              {indexItems.map((item) => (
                <li
                  key={item.id}
                  className="shrink-0 snap-start border-r border-line last:border-r-0"
                >
                  <a
                    href={`#${item.id}`}
                    className="group flex items-baseline gap-2.5 px-4 py-3 hover:bg-white md:px-5"
                  >
                    <span className="font-mono text-[10px] text-mustard">
                      {item.number}
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-teal/70 group-hover:text-teal">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Chapters */}
      {chapters.map((chapter, i) => {
        const imageFirst = i % 2 === 1;
        return (
          <section
            key={chapter.id}
            id={chapter.id}
            className={`band scroll-mt-24 ${
              i % 2 === 0 ? "bg-cream" : "bg-[#FBF3E9]"
            }`}
          >
            <div className="shell">
              <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
                <div
                  className={`relative md:col-span-6 ${
                    imageFirst ? "md:order-2" : ""
                  }`}
                >
                  <span className="marker">
                    <span className="marker-rule" />
                    {chapter.number} · {chapter.kicker}
                  </span>

                  <h2 className="headline mt-4 text-3xl leading-[1.1] md:text-4xl">
                    {chapter.title}
                  </h2>
                  <p className="mt-1 font-serif text-xl font-medium text-mustard md:text-2xl">
                    {chapter.titleHi}
                  </p>

                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-teal/80 md:text-base">
                    {chapter.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>

                  <p className="mt-6 border-l-2 border-mustard pl-4 text-xs leading-relaxed text-teal/70 md:text-sm">
                    {chapter.note}
                  </p>
                </div>

                <div
                  className={`md:col-span-6 ${
                    imageFirst ? "md:order-1" : ""
                  }`}
                >
                  <figure className="relative mx-auto max-w-lg md:max-w-none">
                    <div className="border border-line bg-white p-2.5 shadow-[10px_10px_0_0_rgba(232,184,75,0.35)] md:p-3">
                      <div
                        className={`relative w-full overflow-hidden bg-teal/5 ${
                          ASPECT_CLASS[chapter.imageAspect]
                        }`}
                      >
                        <Image
                          src={chapter.image.src}
                          alt={chapter.image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="px-1 pb-1 pt-2.5 font-mono text-[10px] leading-relaxed text-teal/60 md:text-[11px]">
                        {chapter.image.caption}
                        <span className="mt-1 block text-teal/45">
                          {chapter.image.credit}
                        </span>
                      </figcaption>
                    </div>

                    {chapter.inset ? (
                      <div
                        title={chapter.inset.caption}
                        className="absolute bottom-24 -left-6 hidden w-32 -rotate-2 border-4 border-cream bg-white p-1 shadow-[6px_8px_0_0_rgba(22,86,79,0.14)] md:block lg:-left-10 lg:w-40"
                      >
                        <div className="relative aspect-square overflow-hidden bg-teal/5">
                          <Image
                            src={chapter.inset.src}
                            alt={chapter.inset.alt}
                            fill
                            sizes="160px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : null}
                  </figure>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Epilogue */}
      <section
        id={epilogue.id}
        className="band-teal scroll-mt-24 border-b border-teal/30"
      >
        <div className="shell py-6 md:py-12">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <span className="marker marker--on-dark">
                <span className="marker-rule" />
                {epilogue.number} · {epilogue.kicker}
              </span>
              <h2 className="headline headline--on-dark mt-4 text-3xl leading-[1.05] md:text-5xl">
                {epilogue.title}
              </h2>
              <p className="mt-2 font-serif text-xl font-medium text-mustard md:text-2xl">
                {epilogue.titleHi}
              </p>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-cream/80 md:text-base">
                {epilogue.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="md:col-span-5">
              <figure className="mx-auto max-w-sm md:max-w-none">
                <div className="border border-cream/20 p-2.5 md:p-3">
                  <div className="relative aspect-[4/5] overflow-hidden bg-teal/40">
                    <Image
                      src={epilogue.image.src}
                      alt={epilogue.image.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="pt-3 font-mono text-[10px] leading-relaxed text-cream/55">
                    {epilogue.image.caption}
                    <span className="mt-1 block text-cream/40">
                      {epilogue.image.credit}
                    </span>
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="band">
        <div className="shell">
          <div className="max-w-2xl">
            <span className="marker">
              <span className="marker-rule" />
              The festival in pictures
            </span>
            <h2 className="section-title mt-3">One parv, many rivers</h2>
            <p className="mt-2 text-sm leading-relaxed text-teal/65 md:text-base">
              From the Bagmati at Janakpur to the Yamuna in Delhi, the same four
              days travel with the people who keep them.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {gallery.map((item) => {
              const spanClass =
                item.span === "wide"
                  ? "md:col-span-2 aspect-[16/9]"
                  : item.span === "tall"
                    ? "md:row-span-2 aspect-[3/4]"
                    : "aspect-[4/3]";

              return (
                <figure
                  key={item.src}
                  className={`relative overflow-hidden bg-teal/10 ${spanClass}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      item.span === "wide"
                        ? "(max-width: 768px) 100vw, 66vw"
                        : "(max-width: 768px) 50vw, 33vw"
                    }
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062420]/95 via-[#062420]/25 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-2.5 md:p-4">
                    <p className="text-[11px] font-medium leading-snug text-cream md:text-xs">
                      {item.caption}
                    </p>
                    <p className="mt-1 font-mono text-[9px] leading-relaxed text-cream/60 md:text-[10px]">
                      {item.credit}
                    </p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sources & credits */}
      <section className="band">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <span className="marker">
                <span className="marker-rule" />
                Sources &amp; credits
              </span>
              <h2 className="section-title mt-3">Further reading</h2>

              <ul className="mt-6 divide-y divide-line border-t border-line">
                {sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-6 py-4"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-snug text-teal">
                          {source.title}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-teal/55">
                          {source.note}
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal/35 transition-colors group-hover:text-mustard"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 12 12 4M5.5 4H12v6.5"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-5 md:pl-4">
              <span className="marker">
                <span className="marker-rule" />
                A note on the telling
              </span>
              <div className="mt-5 space-y-3 border-l-2 border-mustard pl-5 text-sm leading-relaxed text-teal/75">
                <p>
                  Chhath has no single founder and no single scripture. The
                  Karna, Draupadi and Sita tellings change with district, family
                  and memory; we have followed the versions most often heard in
                  Bihar.
                </p>
                <p>
                  The images here are illustrative, not documentary. They show
                  the sun, the river and the festival across time, not one
                  historical moment.
                </p>
              </div>
            </div>
          </div>

          <details className="group mt-12 border-t border-line pt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="marker">
                <span className="marker-rule" />
                Image credits &amp; licences
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-teal/60 transition-transform group-open:rotate-45">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-3.5 w-3.5"
                >
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>

            <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {credits.map((credit) => (
                <div key={credit.page} className="border-t border-line/70 pt-3">
                  <p className="text-xs font-semibold leading-snug text-teal/80">
                    {credit.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-teal/50">
                    {credit.artist}
                  </p>
                  <p className="mt-1 font-mono text-[10px] leading-relaxed text-teal/50">
                    {credit.licenseUrl ? (
                      <a
                        href={credit.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-teal"
                      >
                        {credit.license}
                      </a>
                    ) : (
                      credit.license
                    )}
                    <span aria-hidden="true"> · </span>
                    <a
                      href={credit.page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-teal"
                    >
                      Commons
                    </a>
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 font-mono text-[10px] leading-relaxed text-teal/45">
              Photographs are CC BY-SA; paintings are public domain. Images have
              been cropped for layout.
            </p>
          </details>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="band-mustard">
        <div className="shell">
          <span className="marker">
            <span className="marker-rule" />
            After the story
          </span>
          <h2 className="headline mt-4 max-w-3xl text-3xl leading-[1.08] md:text-5xl">
            If this is your first Chhath,
            <br />
            <em>start with the four days.</em>
          </h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${params.locale}/vidhi`} className="btn btn-primary">
              The four days
            </Link>
            <Link
              href={`/${params.locale}/songs`}
              className="btn bg-cream text-teal hover:bg-white"
            >
              Hear the songs
            </Link>
            <Link
              href={`/${params.locale}/ghats`}
              className="btn border border-teal/30 text-teal hover:bg-teal/[.06]"
            >
              Find a ghat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
