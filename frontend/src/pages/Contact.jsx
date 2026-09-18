import React from "react";
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import Reveal from "../components/ui/Reveal";
import { assets } from "../assets/assets";

const details = [
  {
    icon: FiMapPin,
    label: "Our store",
    lines: ["54709 Willms Station", "Suite 350, Washington, USA"],
  },
  {
    icon: FiPhone,
    label: "Phone",
    lines: ["(415) 555-0132"],
  },
  {
    icon: FiMail,
    label: "Email",
    lines: ["admin@forever.com"],
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
          <img
            className="w-full rounded-3xl object-cover shadow-soft"
            src={assets.contact_img}
            alt="The Forever store"
            loading="lazy"
          />
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
              <p className="prata-regular text-xl">Careers at Forever</p>
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
