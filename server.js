import { app } from "./app.js";
import { DBconn } from "./config/db.js";
import env from "dotenv";
import { Category } from "./models/category.js";
import {Product} from "./models/product.js";
import mongoose from "mongoose";
env.config();

const PORT = process.env.PORT || 3000;

DBconn().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
// async function getProductsByCategoryId() {
//   const categoryId = "6829f897272c083e41ce9ce0";

//   const products = await Product.find({
//     category: new mongoose.Types.ObjectId(categoryId),
//   }).populate("category");

//   console.log(products);
//   console.log(mongoose.isValidObjectId(categoryId));
// }

// getProductsByCategoryId();

// async function getProductWithCategory() {
//   const product = await Product.find({ name: "Classic T-Shirt" }).populate(
//     "category"
//   );
//   console.log(product);
// }

// getProductWithCategory();
