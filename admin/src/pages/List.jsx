import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiPackage, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { backendUrl, currency } from "../config";
import { toast } from "react-toastify";
import { ProductListSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  // The product queued for deletion, held until the dialog is confirmed.
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async () => {
    if (!pending) return;

    setDeleting(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: pending._id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setPending(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="prata-regular text-2xl text-ink-950">All products</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {loading
              ? "Loading the catalogue..."
              : `${list.length} ${list.length === 1 ? "product" : "products"} on the storefront`}
          </p>
        </div>

        <Link
          to="/add"
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
        >
          <FiPlus /> Add product
        </Link>
      </div>

      {!loading && list.length === 0 ? (
        <EmptyState
          icon={<FiPackage />}
          title="No products yet"
          description="Nothing is listed on the storefront. Add your first product and it will appear here."
          action={
            <Link
              to="/add"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
            >
              <FiPlus /> Add product
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          {/* Table header, desktop only */}
          {!loading && (
            <div className="hidden grid-cols-[3.5rem_2.5fr_1fr_1fr_auto] items-center gap-4 border-b border-ink-200 bg-ink-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400 md:grid">
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span className="w-19 text-center">Actions</span>
            </div>
          )}

          {loading ? (
            <ProductListSkeleton rows={6} />
          ) : (
            <div className="divide-y divide-ink-200">
              {list.map((item) => (
                <div
                  key={item._id}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-ink-50 md:grid-cols-[3.5rem_2.5fr_1fr_1fr_auto]"
                >
                <img
                  className="h-14 w-14 rounded-xl border border-ink-100 object-cover"
                  src={item.image[0]}
                  alt={item.name}
                  loading="lazy"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {item.name}
                  </p>
                  {/* Category and price move under the name on small screens */}
                  <p className="mt-0.5 text-xs text-ink-500 md:hidden">
                    {item.category} &middot; {currency}
                    {item.price}
                  </p>
                </div>

                <p className="hidden text-sm text-ink-600 md:block">
                  {item.category}
                </p>
                <p className="hidden text-sm font-medium tabular-nums text-ink-900 md:block">
                  {currency}
                  {item.price}
                </p>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/edit/${item._id}`}
                      aria-label={`Edit ${item.name}`}
                      title={`Edit ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
                    >
                      <FiEdit2 className="text-base" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setPending(item)}
                      aria-label={`Delete ${item.name}`}
                      title={`Delete ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-accent-50 hover:text-accent-600"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title={`Delete "${pending?.name}"?`}
        description="This removes the product from the storefront immediately and cannot be undone. Existing orders that contain it are not affected."
        confirmLabel="Delete product"
        busy={deleting}
        onConfirm={removeProduct}
        onCancel={() => setPending(null)}
      />
    </>
  );
};

export default List;
