import { GlassFrame } from "@/components/glass/GlassFrame";
import { FramedPhoto } from "@/components/photos/FramedPhoto";
import { heroGradient } from "@/lib/headerColors";
import { readGlassColors } from "@/lib/glassColorStore";
import { readHeroColors } from "@/lib/heroColorStore";
import { photoFrameCss } from "@/lib/photoFrame";
import { readPhotoFrames } from "@/lib/photoFrameStore";
import { readPhotoSize } from "@/lib/photoSizeStore";

const cards = [
  {
    id: "garage",
    name: "Garage Doors",
    href: "https://garagedoorsofcalgary.ca",
    image: "/images/services/garage-doors.jpg",
    alt: "Residential garage door on a house exterior",
  },
  {
    id: "doors",
    name: "Doors & Windows",
    href: "https://doorsofcalgary.ca",
    image: "/images/services/doors-windows.jpg",
    alt: "Wood entry door with sidelights on a home",
  },
] as const;

export default function HomePage() {
  const glassColors = readGlassColors();
  const photoSize = readPhotoSize();
  const photoFrames = readPhotoFrames();

  return (
    <section
      id="hero"
      className="flex min-h-svh w-full flex-col pt-[var(--site-header-height)] pb-16 md:pb-0 lg:justify-center"
      style={{ background: heroGradient(readHeroColors()) }}
    >
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:block lg:flex-none lg:px-8"
      >
      <h1 className="sr-only">JDM Solutions</h1>
      <div className="mx-auto max-w-2xl text-center">
        <p id="welcome-line" className="font-display text-xl font-bold uppercase tracking-[0.14em] text-primary sm:text-2xl">
          Welcome to JDM Solutions!
        </p>
        <p className="mt-3 text-lg leading-snug text-primary sm:text-xl">
          How can we help today?
        </p>
        <p className="mt-2 text-lg leading-snug text-primary sm:text-xl">
          Choose the service you’re looking for below to explore the right solution.
        </p>
      </div>
      <div id="photo-gap" aria-hidden="true"></div>
      <style>{`#welcome-line{margin-bottom:0.85rem}#photo-gap{display:none}#services{width:min(${photoSize.mobile}%,100%);margin-top:auto;margin-bottom:0.75rem;column-gap:2.25rem}#services>a{align-self:start}#services .photo-frame{aspect-ratio:1 / ${photoSize.mobileRatio}}#services .card-title{color:#fff;font-size:1rem;line-height:1.15}#services .card-visit{color:#fff;font-size:0.75rem;line-height:1.15}@media(max-width:767px){#photo-gap{display:block;flex:1 1 auto;min-height:3.1rem}#services{margin-top:0}}${photoFrameCss(photoFrames)}@media(min-width:640px){#services{column-gap:2.75rem}#services .card-title{font-size:1.125rem}#services .card-visit{font-size:0.875rem}}@media(min-width:1024px){#hero{justify-content:center}#main-content{display:block;flex:none}#services{width:min(${photoSize.desktop}rem,100%);margin-top:4rem;margin-bottom:0;column-gap:2.5rem}#services .photo-frame{aspect-ratio:1 / 1}#services .card-title{font-size:1.25rem}#services .card-visit{font-size:1rem}}`}</style>
      <div
        id="services"
        className="mx-auto mt-auto mb-3 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-1 sm:gap-x-10 lg:mb-0 lg:mt-16"
      >
        {cards.map((card) => (
          <a key={card.href} href={card.href} className="group block min-w-0 self-start">
            <GlassFrame colors={glassColors} className="photo-frame">
              <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#1c1c1c" }} />
              <FramedPhoto
                id={`photo-${card.id}`}
                src={card.image}
                alt={card.alt}
                priority
                sizes="(max-width: 1023px) 80vw, 30rem"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/75 to-transparent"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="absolute bottom-2 left-2 right-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:bottom-3 sm:left-3 sm:right-3">
                <span className="card-title block font-display font-bold">
                  {card.name}
                </span>
                <span className="card-visit mt-0.5 block font-display font-bold">
                  Visit Website
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      width: "0.85em",
                      height: "0.85em",
                      marginLeft: "0.28em",
                      verticalAlign: "-0.05em",
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9 L9 3" />
                    <path d="M4.5 3 H9 V7.5" />
                  </svg>
                </span>
              </span>
            </GlassFrame>
          </a>
        ))}
      </div>
      </main>
    </section>
  );
}
