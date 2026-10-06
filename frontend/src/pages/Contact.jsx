import React from "react";
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import Reveal from "../components/ui/Reveal";
import { LogoMark } from "../components/ui/Logo";
import { BRAND } from "../brand";
import { photoSrcSet, photoUrl } from "../utils/cloudinary";

// pexels.com/@tima-miroshnichenko (8774568), free Pexels License
const STUDIO_PHOTO = "v1791267164/pexels-tima-miroshnichenko-8774568.jpg";

const details = [
  {
    icon: FiMapPin,
    label: "The studio",
    lines: BRAND.address,
  },
  {
    icon: FiPhone,
    label: "Phone",
    lines: [BRAND.phone],
  },
  {
    icon: FiMail,
    label: "Email",
    lines: [BRAND.email],
  },
];

const Contact = () => {
  return (
    <div className="py-10">
      <Title
        center
        text1={"Contact "}
        text2={"Us"}
        subtitle="Questions about sizing, delivery or a return? We are happy to help."
      />

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          {/* The wash and dye room, with a studio postcard pinned over the
              corner. Portrait crop on phones, landscape from sm up - each is a
              separate Cloudinary crop, so neither is just the other squashed. */}
          <div className="group relative aspect-4/5 overflow-hidden rounded-3xl bg-ink-100 shadow-soft sm:aspect-4/3">
            <picture>
              <source
                media="(min-width: 640px)"
                srcSet={photoSrcSet(STUDIO_PHOTO, [640, 960, 1280], "4:3")}
                sizes="(min-width: 1024px) 45vw, 90vw"
              />
              <img
                src={photoUrl(STUDIO_PHOTO, 640)}
                srcSet={photoSrcSet(STUDIO_PHOTO, [480, 800, 1200])}
                sizes="90vw"
                alt="Two people in white work clothes loading garments into the studio's industrial wash and dye machines"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
              />
            </picture>

            <div className="absolute bottom-4 left-4 right-4 -rotate-2 rounded-2xl bg-white p-5 shadow-lift sm:bottom-6 sm:left-6 sm:right-auto sm:w-80">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Visit the studio
                  </p>
                  <p className="type-display mt-2 text-2xl leading-tight text-ink-950">
                    Come and see the
                    <br />
                    dye vats.
                  </p>
                </div>
                {/* Postage stamp */}
                <span
                  aria-hidden="true"
                  className="flex h-14 w-12 shrink-0 items-center justify-center border-2 border-dashed border-ink-300 p-1"
                >
                  <LogoMark className="h-8 w-8" />
                </span>
              </div>

              <p className="mt-4 flex items-center gap-2 border-t border-dashed border-ink-200 pt-3 text-xs text-ink-500">
                <FiClock className="shrink-0" />
                Tuesday to Saturday, 11am &ndash; 6pm
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex flex-col gap-3">
            {details.map(({ icon: Icon, label, lines }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-ink-200 bg-white p-5 transition-shadow hover:shadow-soft"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-700">
                  <Icon />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                    {label}
                  </p>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-sm text-ink-700">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 rounded-2xl bg-ink-950 p-7 text-white">
              <p className="type-display text-xl">Careers at {BRAND.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                We are always looking for people who care about the details.
                Have a look at what is open right now.
              </p>
              <button className="group mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-white/90">
                Explore jobs
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-24">
        <NewsLetterBox />
      </div>
    </div>
  );
};

export default Contact;
