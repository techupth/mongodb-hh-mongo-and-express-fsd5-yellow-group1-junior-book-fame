import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
const collection = db.collection("products");

productRouter.get("/", async (req, res) => {
  const category = req.query.category;
  const name = req.query.name;
  const pageToFetch = Number(req.query.page);
  const itemsPerPage = 5;

  const query = {};
  if (category) {
    query.category = category;
  }
  if (name) {
    query.name = name;
  }

  try {
    const totalItems = await collection.countDocuments(query);

    const products = await collection
      .find(query)
      .sort({ created: -1 })
      .skip((pageToFetch - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .toArray();

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return res.json({
      data: products,
      currentPage: pageToFetch,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

productRouter.get("/:productId", async (req, res) => {
  const productId = new ObjectId(req.params.productId);
  const product = await collection.find({ _id: productId }).toArray();
  return res.json({ data: product });
});

productRouter.post("/", async (req, res) => {
  const productData = { ...req.body, created: new Date(req.body.created) };
  const products = await collection.insertOne(productData);

  return res.json({
    message: `Product (${products.insertedId}) has been created successfully`,
  });
});

productRouter.put("/:productId", async (req, res) => {
  const productId = new ObjectId(req.params.productId);
  const newProductData = { ...req.body };
  try {
    await collection.updateOne({ _id: productId }, { $set: newProductData });
    return res.json({
      message: "Product has been updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

productRouter.delete("/:productId", async (req, res) => {
  const productId = new ObjectId(req.params.productId);
  try {
    await collection.deleteOne({ _id: productId });
    return res.json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default productRouter;
