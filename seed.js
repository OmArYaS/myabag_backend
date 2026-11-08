import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "./models/category.js";
import { Product } from "./models/product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || MONGO_URI.includes("<username>")) {
  console.error(
    "❌ Please set your real MongoDB Atlas credentials in .env (MONGO_URI)"
  );
  process.exit(1);
}

// ─── Women's Bag Categories ──────────────────────────────────────────────
const categories = [
  {
    name: "Handbags",
    description: "Elegant handbags for everyday use and special occasions",
  },
  {
    name: "Tote Bags",
    description: "Spacious tote bags perfect for shopping, work, and travel",
  },
  {
    name: "Shoulder Bags",
    description: "Comfortable shoulder bags with adjustable straps",
  },
  {
    name: "Clutches",
    description: "Sleek clutches for evenings, parties, and formal events",
  },
  {
    name: "Crossbody Bags",
    description: "Hands-free crossbody bags for casual outings",
  },
  {
    name: "Backpacks",
    description: "Fashionable backpacks for school, work, and travel",
  },
  {
    name: "Evening Bags",
    description: "Luxurious evening bags for weddings and galas",
  },
  {
    name: "Travel Bags",
    description: "Durable travel bags and weekenders for your trips",
  },
];

// ─── Women's Bag Products (free images from picsum.photos) ───────────────
const products = [
  // Handbags
  {
    name: "Leather Classic Handbag",
    brand: "Mia Bag",
    price: 1450,
    stock: 25,
    color: "Black",
    size: "Medium",
    description:
      "Timeless leather handbag with gold hardware, top handles, and detachable shoulder strap. Perfect for office and casual outings.",
    categoryName: "Handbags",
    image: "https://picsum.photos/600/600?random=101",
  },
  {
    name: "Saffiano Leather Tote Handbag",
    brand: "Luxora",
    price: 1890,
    stock: 18,
    color: "Cognac",
    size: "Large",
    description:
      "Premium saffiano leather handbag with multiple compartments, ideal for work documents and essentials.",
    categoryName: "Handbags",
    image: "https://picsum.photos/600/600?random=102",
  },
  {
    name: "Mini Structured Handbag",
    brand: "Chic & Co",
    price: 950,
    stock: 32,
    color: "Blush Pink",
    size: "Small",
    description:
      "Adorable mini structured handbag with chain strap detail. Great for evenings and date nights.",
    categoryName: "Handbags",
    image: "https://picsum.photos/600/600?random=103",
  },

  // Tote Bags
  {
    name: "Canvas Shopping Tote",
    brand: "EcoCarry",
    price: 620,
    stock: 40,
    color: "Natural",
    size: "Large",
    description:
      "Eco-friendly canvas tote bag with sturdy handles. Spacious enough for groceries, books, and beach essentials.",
    categoryName: "Tote Bags",
    image: "https://picsum.photos/600/600?random=104",
  },
  {
    name: "Leather Work Tote",
    brand: "Urban Elite",
    price: 2150,
    stock: 22,
    color: "Navy Blue",
    size: "Large",
    description:
      "Professional leather tote with laptop compartment, zip closure, and interior pockets for organization.",
    categoryName: "Tote Bags",
    image: "https://picsum.photos/600/600?random=105",
  },
  {
    name: "Straw Summer Tote",
    brand: "Boho Chic",
    price: 580,
    stock: 35,
    color: "Beige",
    size: "Large",
    description:
      "Lightweight woven straw tote perfect for summer vacations, farmers markets, and beach days.",
    categoryName: "Tote Bags",
    image: "https://picsum.photos/600/600?random=106",
  },

  // Shoulder Bags
  {
    name: "Quilted Shoulder Bag",
    brand: "Velvet Lane",
    price: 1650,
    stock: 20,
    color: "Burgundy",
    size: "Medium",
    description:
      "Diamond-quilted shoulder bag with chain-and-leather strap. Sophisticated and timeless.",
    categoryName: "Shoulder Bags",
    image: "https://picsum.photos/600/600?random=107",
  },
  {
    name: "Suede Hobo Shoulder Bag",
    brand: "Soft Touch",
    price: 1100,
    stock: 28,
    color: "Taupe",
    size: "Medium",
    description:
      "Slouchy suede hobo bag with magnetic snap closure and adjustable shoulder strap.",
    categoryName: "Shoulder Bags",
    image: "https://picsum.photos/600/600?random=108",
  },
  {
    name: "Structured Shoulder Satchel",
    brand: "Heritage Bags",
    price: 1980,
    stock: 15,
    color: "Brown",
    size: "Medium",
    description:
      "Structured satchel with top handle and detachable shoulder strap. Ideal for business casual looks.",
    categoryName: "Shoulder Bags",
    image: "https://picsum.photos/600/600?random=109",
  },

  // Clutches
  {
    name: "Satin Evening Clutch",
    brand: "Glamour Night",
    price: 720,
    stock: 45,
    color: "Champagne",
    size: "Small",
    description:
      "Satin clutch with fold-over closure and wrist strap. Perfect for weddings and cocktail parties.",
    categoryName: "Clutches",
    image: "https://picsum.photos/600/600?random=110",
  },
  {
    name: "Envelope Leather Clutch",
    brand: "Minimal Studio",
    price: 850,
    stock: 38,
    color: "Black",
    size: "Small",
    description:
      "Sleek envelope-style leather clutch with snap button closure. Compact yet fits phone and cards.",
    categoryName: "Clutches",
    image: "https://picsum.photos/600/600?random=111",
  },
  {
    name: "Beaded Evening Clutch",
    brand: "Royal Sparkle",
    price: 1350,
    stock: 12,
    color: "Gold",
    size: "Small",
    description:
      "Hand-beaded clutch with intricate detailing and chain strap. A statement piece for formal events.",
    categoryName: "Clutches",
    image: "https://picsum.photos/600/600?random=112",
  },

  // Crossbody Bags
  {
    name: "Nylon Crossbody Bag",
    brand: "Active Life",
    price: 540,
    stock: 50,
    color: "Black",
    size: "Small",
    description:
      "Lightweight water-resistant nylon crossbody with multiple zip pockets. Great for travel and daily errands.",
    categoryName: "Crossbody Bags",
    image: "https://picsum.photos/600/600?random=113",
  },
  {
    name: "Leather Crossbody Saddle Bag",
    brand: "Rider Style",
    price: 1250,
    stock: 30,
    color: "Tan",
    size: "Medium",
    description:
      "Classic saddle-shaped leather crossbody with flap closure and long adjustable strap.",
    categoryName: "Crossbody Bags",
    image: "https://picsum.photos/600/600?random=114",
  },
  {
    name: "Mini Crossbody Chain Bag",
    brand: "Teen Vogue",
    price: 790,
    stock: 42,
    color: "Silver",
    size: "Mini",
    description:
      "Mini crossbody with metallic chain strap. Perfect for concerts, parties, and nights out.",
    categoryName: "Crossbody Bags",
    image: "https://picsum.photos/600/600?random=115",
  },

  // Backpacks
  {
    name: "Vegan Leather Backpack",
    brand: "Green Carry",
    price: 1550,
    stock: 24,
    color: "Olive Green",
    size: "Medium",
    description:
      "Eco-friendly vegan leather backpack with laptop sleeve, front pockets, and adjustable padded straps.",
    categoryName: "Backpacks",
    image: "https://picsum.photos/600/600?random=116",
  },
  {
    name: "Canvas School Backpack",
    brand: "Student Plus",
    price: 890,
    stock: 55,
    color: "Dark Blue",
    size: "Large",
    description:
      "Durable canvas backpack with multiple compartments, side water bottle holder, and padded back panel.",
    categoryName: "Backpacks",
    image: "https://picsum.photos/600/600?random=117",
  },
  {
    name: "Faux Leather Mini Backpack",
    brand: "Street Style",
    price: 980,
    stock: 36,
    color: "Burgundy",
    size: "Small",
    description:
      "Trendy mini faux leather backpack with top handle and adjustable shoulder straps.",
    categoryName: "Backpacks",
    image: "https://picsum.photos/600/600?random=118",
  },

  // Evening Bags
  {
    name: "Crystal Evening Bag",
    brand: "Night Elegance",
    price: 2450,
    stock: 8,
    color: "Silver",
    size: "Small",
    description:
      "Luxurious crystal-embellished evening bag with detachable chain strap. For weddings and galas.",
    categoryName: "Evening Bags",
    image: "https://picsum.photos/600/600?random=119",
  },
  {
    name: "Satin Ruffle Evening Clutch",
    brand: "Bridal Bliss",
    price: 1150,
    stock: 15,
    color: "Ivory",
    size: "Small",
    description:
      "Soft satin clutch with ruffle detailing and pearl accent. Ideal for bridesmaids and wedding guests.",
    categoryName: "Evening Bags",
    image: "https://picsum.photos/600/600?random=120",
  },
  {
    name: "Metallic Box Evening Bag",
    brand: "Starlet",
    price: 1750,
    stock: 10,
    color: "Rose Gold",
    size: "Small",
    description:
      "Structured metallic box bag with magnetic clasp and chain strap. A modern evening statement.",
    categoryName: "Evening Bags",
    image: "https://picsum.photos/600/600?random=121",
  },

  // Travel Bags
  {
    name: "Leather Weekender Travel Bag",
    brand: "Journey Co",
    price: 3200,
    stock: 14,
    color: "Chocolate Brown",
    size: "Large",
    description:
      "Spacious leather weekender with shoe compartment, detachable shoulder strap, and top handles.",
    categoryName: "Travel Bags",
    image: "https://picsum.photos/600/600?random=122",
  },
  {
    name: "Nylon Travel Duffel",
    brand: "Fly Light",
    price: 1450,
    stock: 26,
    color: "Black",
    size: "Large",
    description:
      "Water-resistant nylon duffel bag with multiple compartments, perfect for gym and weekend trips.",
    categoryName: "Travel Bags",
    image: "https://picsum.photos/600/600?random=123",
  },
  {
    name: "Canvas Carry-On Travel Bag",
    brand: "Wanderlust",
    price: 2050,
    stock: 19,
    color: "Khaki",
    size: "Large",
    description:
      "Sturdy canvas carry-on with leather trim, zip closure, and luggage strap for easy airport travel.",
    categoryName: "Travel Bags",
    image: "https://picsum.photos/600/600?random=124",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing categories and products");

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📂 Created ${createdCategories.length} categories`);

    // Map category names to their ObjectIds
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Insert products with category references
    const cleanProducts = products.map((p) => {
      const { categoryName, ...rest } = p;
      return {
        ...rest,
        category: categoryMap[categoryName],
      };
    });

    const createdProducts = await Product.insertMany(cleanProducts);
    console.log(`👜 Created ${createdProducts.length} products`);

    console.log("\n🎉 Seeding complete!");
    console.log("Categories:");
    createdCategories.forEach((c) => console.log(`   - ${c.name}`));
    console.log("\nSample products:");
    createdProducts.slice(0, 5).forEach((p) =>
      console.log(`   - ${p.name} - EGP ${p.price}`)
    );
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB Atlas");
  }
}

seed();
