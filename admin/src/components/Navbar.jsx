import React from "react";
import { FiLogOut } from "react-icons/fi";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  // Clearing state is enough - App writes the token back to localStorage and
  // swaps in the login screen. This used to call localStorage.clear(), which
  // wiped unrelated keys, and then force a full page reload.
  const logoutHandler = () => setToken("");

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/85 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img className="h-8 w-auto" src={assets.logo} alt="Forever" />
          <span className="hidden rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 sm:block">
            Admin
          </span>
        </div>

        <button
          type="button"
          onClick={logoutHandler}
          className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
        >
          <FiLogOut className="text-base" />
          <span className="hidden sm:block">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
