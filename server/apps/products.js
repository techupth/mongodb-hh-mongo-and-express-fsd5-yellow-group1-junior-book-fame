import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const products = await collection.find({}).toArray();
  return res.json({ data: products });
});

productRouter.get("/:id", async (req, res) => {});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body };
  const products = await collection.insertOne(productData);

  return res.json({
    message: `Product (${products.insertedId}) has been created successfully`,
  });
});

productRouter.put("/:productId", async (req, res) => {
  const collection = db.collection("products");
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
  const collection = db.collection("products");
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
