// server.js
import mongoose from "mongoose";

const uri =
  "mongodb+srv://mry097760:7xeNjZ3CGrIBYSNg@myabag.pvoeptg.mongodb.net/myabag?retryWrites=true&w=majority";
  

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
