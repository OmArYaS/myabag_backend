// server.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in .env file");
}

try {
  await mongoose.connect(uri);

  console.log("✅ متصل بقاعدة البيانات باستخدام Mongoose");

  await getCollections(); // طباعة أسماء الـCollections
} catch (err) {
  console.error("❌ فشل الاتصال:", err);
}

async function getCollections() {
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log(
    "📁 المجموعات الموجودة:",
    collections.map((c) => c.name)
  );
}
