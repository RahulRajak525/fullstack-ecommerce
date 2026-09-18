import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import ProductForm from "../components/ProductForm";

function Add({ token }) {
  // The form owns the fields; this only posts them and reports success, which
  // is how the form knows whether to reset itself.
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
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
        <h1 className="prata-regular text-2xl text-ink-950">Add a product</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Anything saved here appears on the storefront straight away.
        </p>
      </div>

      <ProductForm mode="create" onSubmit={handleSubmit} />
    </>
  );
}

export default Add;
