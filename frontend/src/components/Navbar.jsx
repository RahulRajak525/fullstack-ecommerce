import { useContext, useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiPackage,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const links = [
  { to: "/", label: "HOME" },
  { to: "/collection", label: "COLLECTION" },
  { to: "/about", label: "ABOUT" },
  { to: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef(null);

  const { setShowSearch, getCartCount, navigate, token, logout } =
    useContext(ShopContext);

  const cartCount = getCartCount();

  // Add a border + shadow only once the page has moved
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account dropdown on an outside click or Escape
  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setUserOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleUserClick = () => {
    if (!token || !token.trim()) {
      navigate("/login");
      return;
    }
    setUserOpen((v) => !v);
  };

  return (
    <>
      {/* Announcement strip */}
      <div className="bg-ink-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          Free shipping on orders over $80
          <span className="hidden text-white/40 sm:inline">&bull;</span>
          <span className="hidden text-white/70 sm:inline">
            Easy 7-day returns
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-ink-200/70 shadow-soft"
            : "border-b border-transparent bg-ink-50"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="shrink-0" aria-label="Forever home">
            <motion.img
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              src={assets.logo}
              className="w-28 sm:w-32"
              alt="Forever"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 md:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative py-1 text-[13px] font-medium tracking-[0.12em] transition-colors ${
                      isActive
                        ? "text-ink-900"
                        : "text-ink-500 hover:text-ink-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 h-[1.5px] w-full bg-ink-900"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setShowSearch(true);
                navigate("/collection");
              }}
              aria-label="Search products"
              className="rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              <FiSearch className="text-[19px]" />
            </button>

            {/* Account */}
            <div className="relative" ref={userRef}>
              <button
                onClick={handleUserClick}
                aria-label="Account"
                aria-expanded={userOpen}
                className="rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                <FiUser className="text-[19px]" />
              </button>

              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-2 w-52 origin-top-right overflow-hidden rounded-2xl border border-ink-200 bg-white p-1.5 shadow-lift"
                  >
                    <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                      My account
                    </p>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setUserOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-100"
                    >
                      <FiPackage className="text-base" /> Orders
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-accent-600 transition-colors hover:bg-accent-50"
                    >
                      <FiLogOut className="text-base" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <NavLink
              to="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              <FiShoppingBag className="text-[19px]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-semibold text-white"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100 md:hidden"
            >
              <FiMenu className="text-[20px]" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-60 bg-ink-950/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-70 flex h-full w-[78%] max-w-xs flex-col bg-white shadow-lift md:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                  Menu
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-ink-700 hover:bg-ink-100"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col p-2">
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.35 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium tracking-wide transition-colors ${
                          isActive
                            ? "bg-ink-900 text-white"
                            : "text-ink-700 hover:bg-ink-100"
                        }`
                      }
                    >
                      {link.label}
                      <FiChevronRight className="opacity-50" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto border-t border-ink-200 p-4">
                {token ? (
                  <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 py-3 text-sm font-medium text-accent-600"
                  >
                    <FiLogOut /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3 text-sm font-medium text-white"
                  >
                    <FiUser /> Sign in
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
