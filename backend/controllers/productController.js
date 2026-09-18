import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import productModel from "../models/productModal.js";
import { ApiError } from "../middleware/errorHandler.js";

// function for add product

const addProduct = async (req, res) => {
  const { name, description, price, category, subCategory, sizes, bestseller } =
    req.body;

  if (!name || !description || !category || !subCategory) {
    throw new ApiError(
      400,
      "Name, description, category and subCategory are required",
    );
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, "Price must be a positive number");
  }

  // sizes arrives as a JSON string from the multipart form
  let parsedSizes;
  try {
    parsedSizes = JSON.parse(sizes);
  } catch {
    throw new ApiError(400, "Sizes must be a valid JSON array");
  }
  if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
    throw new ApiError(400, "At least one size is required");
  }

  const images = ["image1", "image2", "image3", "image4"]
    .map((field) => req.files?.[field]?.[0])
    .filter(Boolean);

  if (images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  try {
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          // let Cloudinary serve smaller, better-compressed images
          quality: "auto",
          fetch_format: "auto",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: numericPrice,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product added" });
  } finally {
    // Always clean up multer's temp files, success or failure, otherwise
    // they pile up in the OS temp directory forever.
    await Promise.all(
      images.map((item) => fs.unlink(item.path).catch(() => {})),
    );
  }
};

// function for list product

const listProducts = async (req, res) => {
  // The storefront loads the full catalogue and filters client-side, so this
  // returns everything by default. Pass ?page= / ?limit= to paginate.
  const limit = Math.min(Number(req.query.limit) || 0, 100);
  const page = Math.max(Number(req.query.page) || 1, 1);

  const query = productModel.find({}).sort({ date: -1 }).lean();
  if (limit) {
    query.skip((page - 1) * limit).limit(limit);
  }

  const products = await query;

  // The catalogue changes rarely - let the browser reuse it for a minute
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, products });
};

// function for removing product

const removeProduct = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  const deleted = await productModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, message: "Product removed" });
};

// function for single product info

const singleProduct = async (req, res) => {
  const productId = req.body.productId || req.params.productId;
  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await productModel.findById(productId).lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, product });
};

export { addProduct, listProducts, removeProduct, singleProduct };
