import { app } from "./app.js";
import { DBconn } from "./config/db.js";
import env from "dotenv";
import { Category } from "./models/category.js";
import {Product} from "./models/product.js";
import mongoose from "mongoose";
env.config();

const PORT = process.env.PORT || 3000;

DBconn()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

import fetch from "node-fetch";

const getIP = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    console.log("Public IP:", data.ip);
  } catch (err) {
    console.error("⚠️  Could not fetch public IP:", err.message);
  }
};

getIP();
