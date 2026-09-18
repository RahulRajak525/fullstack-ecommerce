import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import ProductForm from "../components/ProductForm";
import { Skeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

/** Placeholder shaped like the form, so the page does not jump when it loads. */
function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-ink-200 bg-white p-5 sm:p-7">
      <div>
        <Skeleton className="h-3 w-40" />
        <div className="mt-3 grid max-w-md grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-11 max-w-xl rounded-xl" />
      <Skeleton className="h-28 max-w-xl rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-72 rounded-full" />
      <Skeleton className="h-12 w-44 rounded-full" />
    </div>
  );
}

function Edit({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.post(backendUrl + "/api/product/single", {
        productId: id,
      });

      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.log(error);
      // A 404 here means the product is gone, which the page explains rather
      // than reporting as a failed request.
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error(error.response?.data?.message || error.message);
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list");
        return true;
      }

      toast.error(response.data.message);
      return false;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link
          to="/list"
          className="inline-flex items-center gap-2 text-xs font-medium text-ink-500 transition-colors hover:text-ink-900"
        >
          <FiArrowLeft /> Back to products
        </Link>

        <h1 className="prata-regular mt-3 text-2xl text-ink-950">
          Edit product
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {loading
            ? "Loading the product..."
            : product
              ? "Changes go live on the storefront as soon as you save."
              : "This product could not be loaded."}
        </p>
      </div>

      {loading ? (
        <FormSkeleton />
      ) : notFound || !product ? (
        <EmptyState
          icon={<FiAlertCircle />}
          title="Product not found"
          description="It may have been deleted since the list was loaded."
          action={
            <Link
              to="/list"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
            >
              Back to products
            </Link>
          }
        />
      ) : (
        <ProductForm
          mode="edit"
          initial={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/list")}
        />
      )}
    </>
  );
}

export default Edit;
