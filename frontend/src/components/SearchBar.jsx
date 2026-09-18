import { useContext, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiSearch, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const inputRef = useRef(null);

  const visible = location.pathname.includes("collection");
  const open = showSearch && visible;

  // Focus the field as soon as it opens, and allow Escape to dismiss it
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowSearch(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setShowSearch]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 py-5">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-ink-200 bg-white px-5 py-3 shadow-soft transition-colors focus-within:border-ink-900">
              <FiSearch className="shrink-0 text-ink-400" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
                type="text"
                placeholder="Search for shirts, jackets, joggers..."
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
                >
                  <FiX className="text-sm" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
              className="rounded-full border border-ink-200 p-3 text-ink-600 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
            >
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchBar;
