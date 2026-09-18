import React, { useEffect, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import Spinner from "./ui/Spinner";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];

/** Shared field styling, so every input on the form matches. */
const fieldClass =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-ink-900 focus:outline-none";

const labelClass = "mb-2 block text-xs font-medium text-ink-600";

/**
 * A slot holds one of:
 *   null                              - empty
 *   { kind: "url", url }              - an image already on the product
 *   { kind: "file", file, preview }   - a newly picked file
 */
const EMPTY_SLOTS = [null, null, null, null];

function slotsFromProduct(product) {
  if (!product?.image?.length) return EMPTY_SLOTS;
  return EMPTY_SLOTS.map((_, i) =>
    product.image[i] ? { kind: "url", url: product.image[i] } : null,
  );
}

/** One image slot, with its own preview and clear button. */
function ImageSlot({ id, slot, onPick, onClear }) {
  const preview =
    slot?.kind === "file" ? slot.preview : slot?.kind === "url" ? slot.url : null;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="group flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink-300 bg-ink-50 transition-colors hover:border-ink-500"
      >
        {preview ? (
          <img className="h-full w-full object-cover" src={preview} alt="" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-ink-400 transition-colors group-hover:text-ink-600">
            <FiUploadCloud className="text-xl" />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              Upload
            </span>
          </span>
        )}
        <input
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) onPick(file);
            // Clearing lets the same file be re-picked after a removal
            e.target.value = "";
          }}
          type="file"
          accept="image/*"
          id={id}
          hidden
        />
      </label>

      {slot && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove image"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-white transition-colors hover:bg-accent-600"
        >
          <FiX className="text-xs" />
        </button>
      )}
    </div>
  );
}

/**
 * Create/edit form for a product. `onSubmit` receives a ready FormData and
 * returns true on success, which is when a create resets the fields.
 */
export default function ProductForm({
  mode = "create",
  initial = null,
  onSubmit,
  onCancel,
}) {
  const [slots, setSlots] = useState(() => slotsFromProduct(initial));
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Men");
  const [subCategory, setSubCategory] = useState(
    initial?.subCategory ?? "Topwear",
  );
  const [price, setPrice] = useState(String(initial?.price ?? "25"));
  const [sizes, setSizes] = useState(initial?.sizes ?? []);
  const [bestseller, setBestseller] = useState(Boolean(initial?.bestseller));
  const [submitting, setSubmitting] = useState(false);

  // Object URLs for the picked files are revoked on unmount so previews do not
  // leak while an admin swaps images around.
  useEffect(() => {
    return () => {
      slots.forEach((slot) => {
        if (slot?.kind === "file") URL.revokeObjectURL(slot.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSlot = (index, next) =>
    setSlots((prev) => {
      const current = prev[index];
      if (current?.kind === "file") URL.revokeObjectURL(current.preview);
      return prev.map((slot, i) => (i === index ? next : slot));
    });

  const pickImage = (index, file) =>
    setSlot(index, {
      kind: "file",
      file,
      preview: URL.createObjectURL(file),
    });

  const toggleSize = (size) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (initial?._id) formData.append("id", initial._id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      slots.forEach((slot, i) => {
        if (slot?.kind === "file") formData.append(`image${i + 1}`, slot.file);
      });

      // Tells the server which existing images survive this edit
      formData.append(
        "keepImages",
        JSON.stringify(slots.map((slot) => (slot?.kind === "url" ? slot.url : null))),
      );

      const ok = await onSubmit(formData);

      if (ok && mode === "create") {
        setSlots(EMPTY_SLOTS);
        setName("");
        setDescription("");
        setPrice("25");
        setSizes([]);
        setBestseller(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const hasImage = slots.some(Boolean);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-ink-200 bg-white p-5 sm:p-7"
    >
      <div>
        <p className={labelClass}>
          Images{" "}
          <span className="font-normal text-ink-400">
            &mdash; the first is used as the main product shot
          </span>
        </p>
        <div className="grid max-w-md grid-cols-4 gap-3">
          {slots.map((slot, i) => (
            <ImageSlot
              key={i}
              id={`image${i + 1}`}
              slot={slot}
              onPick={(file) => pickImage(i, file)}
              onClear={() => setSlot(i, null)}
            />
          ))}
        </div>
        {!hasImage && (
          <p className="mt-2 text-xs text-accent-600">
            At least one image is required.
          </p>
        )}
      </div>

      <div className="max-w-xl">
        <label htmlFor="product-name" className={labelClass}>
          Product name
        </label>
        <input
          id="product-name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className={fieldClass}
          type="text"
          placeholder="e.g. Heavyweight Cotton Tee"
          required
        />
      </div>

      <div className="max-w-xl">
        <label htmlFor="product-description" className={labelClass}>
          Product description
        </label>
        <textarea
          id="product-description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          rows={4}
          className={`${fieldClass} resize-y`}
          placeholder="Fabric, fit and anything a customer would ask before buying."
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        <div>
          <label htmlFor="product-category" className={labelClass}>
            Category
          </label>
          <select
            id="product-category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className={fieldClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-subcategory" className={labelClass}>
            Sub category
          </label>
          <select
            id="product-subcategory"
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className={fieldClass}
          >
            {SUB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-price" className={labelClass}>
            Price
          </label>
          <input
            id="product-price"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className={fieldClass}
            type="number"
            min="0"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <p className={labelClass}>Sizes available</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isOn = sizes.includes(size);

            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                aria-pressed={isOn}
                className={`min-w-12 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  isOn
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <label
        htmlFor="bestseller"
        className="flex w-fit cursor-pointer items-center gap-3 text-sm text-ink-700"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
            bestseller ? "border-ink-900 bg-ink-900" : "border-ink-300"
          }`}
        >
          {bestseller && (
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="sr-only"
        />
        Feature in bestsellers
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-5">
        <button
          type="submit"
          disabled={submitting || !hasImage}
          className="flex items-center justify-center gap-2 rounded-full bg-ink-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
        >
          {submitting && <Spinner />}
          {submitting
            ? mode === "edit"
              ? "Saving..."
              : "Adding..."
            : mode === "edit"
              ? "Save changes"
              : "Add product"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink-900 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
