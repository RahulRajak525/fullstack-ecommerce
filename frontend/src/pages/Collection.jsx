import React, { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { FiFilter, FiSearch, FiSliders, FiX } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import CollectionBanner from "../components/CollectionBanner";
import FilterPills from "../components/FilterPills";
import Marquee from "../components/Marquee";
import ProductItem from "../components/ProductItem";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { staggerChild, staggerParent } from "../components/ui/motionVariants";

const CATEGORIES = ["Men", "Women", "Kids"];
const TYPES = ["Topwear", "Bottomwear", "Winterwear"];

/** Checkbox row used by both filter groups. */
function FilterRow({ label, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink-600 transition-colors hover:text-ink-900">
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all ${
          checked
            ? "border-ink-900 bg-ink-900"
            : "border-ink-300 group-hover:border-ink-500"
        }`}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            viewBox="0 0 16 16"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" />
          </motion.svg>
        )}
      </span>
      <input
        type="checkbox"
        value={label}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function Collection() {
  const { products, search, showSearch, loadingProducts, setShowSearch } =
    useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  // The home page links in as /collection?category=Women, so the matching box
  // starts ticked. Read once - after that the checkboxes own the state.
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(() => {
    const requested = searchParams.get("category");
    return CATEGORIES.includes(requested) ? [requested] : [];
  });
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleValue = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );

  const toggle = (setter) => (e) => toggleValue(setter)(e.target.value);

  // Filtering and sorting are pure derivations of state, so they belong in a
  // memo rather than in effects writing back into state.
  const filterProducts = useMemo(() => {
    let list = products.slice();

    if (showSearch && search) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (category.length) {
      list = list.filter((item) => category.includes(item.category));
    }
    if (subCategory.length) {
      list = list.filter((item) => subCategory.includes(item.subCategory));
    }

    if (sortType === "low-high") list.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, showSearch, category, subCategory, sortType]);

  const activeCount = category.length + subCategory.length;

  const clearAll = () => {
    setCategory([]);
    setSubCategory([]);
  };

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
          Categories
        </p>
        {CATEGORIES.map((c) => (
          <FilterRow
            key={c}
            label={c}
            checked={category.includes(c)}
            onChange={toggle(setCategory)}
          />
        ))}
      </div>

      <div className="border-t border-ink-200 pt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
          Type
        </p>
        {TYPES.map((t) => (
          <FilterRow
            key={t}
            label={t}
            checked={subCategory.includes(t)}
            onChange={toggle(setSubCategory)}
          />
        ))}
      </div>

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center justify-center gap-2 rounded-full border border-ink-200 py-2.5 text-xs font-medium text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
        >
          <FiX /> Clear filters ({activeCount})
        </button>
      )}
    </div>
  );

  // Chips for whatever is currently on, so it can be removed in one tap.
  const activeFilters = [
    ...category.map((value) => ({ value, remove: toggleValue(setCategory) })),
    ...subCategory.map((value) => ({
      value,
      remove: toggleValue(setSubCategory),
    })),
  ];

  return (
    <div className="py-10">
      <CollectionBanner total={products.length} loading={loadingProducts} />

      <div className="mt-10 flex flex-col gap-4 border-b border-ink-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">
          {loadingProducts ? (
            "Fetching products..."
          ) : (
            <>
              {/* Keyed so the number replays its pop whenever the count moves */}
              <span
                key={filterProducts.length}
                className="inline-block animate-pop font-semibold text-ink-900"
              >
                {filterProducts.length}
              </span>{" "}
              {filterProducts.length === 1 ? "product" : "products"}
              {search && showSearch && (
                <>
                  {" "}
                  for &ldquo;
                  <span className="text-ink-900">{search}</span>&rdquo;
                </>
              )}
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(true)}
            className="relative flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 lg:hidden"
          >
            <FiFilter className="text-base" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] text-white">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative">
            <FiSliders className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-400" />
            <select
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
              aria-label="Sort products"
              className="appearance-none rounded-full border border-ink-200 bg-white py-2.5 pl-10 pr-9 text-sm text-ink-700 transition-colors hover:border-ink-400 focus:border-ink-900 focus:outline-none"
            >
              <option value="relevant">Relevance</option>
              <option value="low-high">Price: low to high</option>
              <option value="high-low">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick filters - the same state the checkbox panel drives */}
      <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:gap-8">
        <FilterPills
          label="Shop for"
          options={CATEGORIES}
          active={category}
          onToggle={toggleValue(setCategory)}
          onClear={() => setCategory([])}
        />
        <FilterPills
          label="Type"
          options={TYPES}
          active={subCategory}
          onToggle={toggleValue(setSubCategory)}
          onClear={() => setSubCategory([])}
        />
      </div>

      <AnimatePresence initial={false}>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 pt-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                Active
              </span>

              <AnimatePresence mode="popLayout">
                {activeFilters.map(({ value, remove }) => (
                  <motion.button
                    key={value}
                    layout
                    type="button"
                    onClick={() => remove(value)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.22 }}
                    className="group flex items-center gap-2 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-medium text-white"
                  >
                    {value}
                    <FiX className="text-sm text-white/60 transition-colors group-hover:text-white" />
                  </motion.button>
                ))}
              </AnimatePresence>

              <button
                onClick={clearAll}
                className="ml-1 text-xs font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                <span className="link-underline">Clear all</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-10 pt-8">
        {/* Desktop filters */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-28 rounded-2xl border border-ink-200 bg-white p-5">
            {filterPanel}
          </div>
        </aside>

        {/* Grid */}
        <section className="flex-1">
          {loadingProducts ? (
            <ProductGridSkeleton
              count={12}
              className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
            />
          ) : filterProducts.length === 0 ? (
            <EmptyState
              icon={<FiSearch />}
              title="No products found"
              description="Try removing a filter or searching for something else."
              actionLabel={activeCount ? "Clear filters" : "Open search"}
              onAction={activeCount ? clearAll : () => setShowSearch(true)}
            />
          ) : (
            <motion.div
              variants={staggerParent}
              initial="hidden"
              animate="show"
              key={`${sortType}-${category.join()}-${subCategory.join()}-${search}`}
              className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
            >
              {filterProducts.map((item) => (
                <motion.div key={item._id} variants={staggerChild}>
                  <ProductItem
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.image}
                    bestseller={item.bestseller}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {/* Closing reassurance strip, same ticker as the home page */}
      <div className="mt-16">
        <Marquee />
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 z-80 bg-ink-950/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-90 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 lg:hidden"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-ink-200" />
              <div className="mb-5 flex items-center justify-between">
                <p className="text-base font-medium">Filters</p>
                <button
                  onClick={() => setShowFilter(false)}
                  aria-label="Close filters"
                  className="rounded-full p-2 text-ink-500 hover:bg-ink-100"
                >
                  <FiX />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setShowFilter(false)}
                className="mt-6 w-full rounded-full bg-ink-900 py-3.5 text-sm font-medium text-white"
              >
                Show {filterProducts.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Collection;
