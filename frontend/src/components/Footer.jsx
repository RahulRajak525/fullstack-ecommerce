import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from "react-icons/fi";
import { assets } from "../assets/assets";

const company = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/collection" },
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const socials = [
  { Icon: FiInstagram, label: "Instagram" },
  { Icon: FiTwitter, label: "Twitter" },
  { Icon: FiFacebook, label: "Facebook" },
];

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-ink-200 pt-16">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1.3fr]">
        {/* Brand */}
        <div>
          <img src={assets.logo} className="w-32" alt="Forever" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-500">
            Considered wardrobe staples in durable fabrics. Designed to be worn
            season after season, not thrown away after one.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-all hover:-translate-y-0.5 hover:border-ink-900 hover:bg-ink-900 hover:text-white"
              >
                <Icon className="text-base" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Company
          </p>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-ink-600">
            {company.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="link-underline transition-colors hover:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Get in touch
          </p>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-ink-600">
            <li>+1-000-000-0000</li>
            <li className="flex items-center gap-2">
              <FiMail className="text-ink-400" />
              hello@forever.com
            </li>
            <li className="text-ink-500">
              54709 Willms Station, Suite 350
              <br />
              Washington, USA
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 rounded-2xl border border-ink-200 bg-ink-100/60 px-5 py-4">
        <p className="text-xs leading-relaxed text-ink-500">
          <span className="font-semibold text-ink-700">Portfolio demo.</span>{" "}
          Forever is a full-stack project built to demonstrate the storefront,
          admin panel and API. Products, prices, reviews, company details and
          figures throughout the site are sample content, and no order placed
          here is fulfilled.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-ink-200 py-7 sm:flex-row">
        <p className="text-xs text-ink-400">
          &copy; {new Date().getFullYear()} Forever &mdash; demo storefront.
        </p>
        <div className="flex gap-6 text-xs text-ink-400">
          <a href="#" className="transition-colors hover:text-ink-900">
            Privacy policy
          </a>
          <a href="#" className="transition-colors hover:text-ink-900">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
