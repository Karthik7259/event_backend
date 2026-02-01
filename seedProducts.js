import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from './models/ProductModel.js';

dotenv.config();

const products = [
  {
    name: "Professional Catering Chafing Dish Set",
    description: "Complete 8-piece chafing dish set with fuel holders, perfect for buffet-style events. Keeps food warm for hours. Includes serving utensils.",
    category: "Catering",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
    ],
    pricePerDay: 45,
    quantity: 20,
    availableQuantity: 20,
    features: [
      "8-quart capacity",
      "Stainless steel construction",
      "Includes fuel holders",
      "Water pan and food pan included",
      "Easy to clean"
    ],
    specifications: "Made from high-quality stainless steel with 8-quart capacity. Dimensions: 24x14x12 inches, Weight: 15 lbs. Perfect for keeping food warm during buffet service.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.5,
    reviews: [],
    tags: ["catering", "buffet", "food warmer", "chafing dish"],
    depositAmount: 100
  },
  {
    name: "LED String Fairy Lights - 100ft",
    description: "Beautiful warm white LED string lights perfect for weddings, parties, and outdoor events. Weather-resistant and energy-efficient.",
    category: "Decoration",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800&q=80"
    ],
    pricePerDay: 25,
    quantity: 50,
    availableQuantity: 50,
    features: [
      "100 feet long",
      "Warm white LEDs",
      "Weather-resistant",
      "Low energy consumption",
      "Multiple lighting modes"
    ],
    specifications: "100 feet long string with 300 warm white LED bulbs. IP44 waterproof rating for outdoor use. Power source: 110V AC. Multiple lighting modes including steady, flash, and fade.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.8,
    reviews: [],
    tags: ["decoration", "lights", "fairy lights", "wedding", "outdoor"],
    depositAmount: 50
  },
  {
    name: "Professional DJ Sound System Package",
    description: "Complete DJ sound system with 2000W power output. Includes speakers, mixer, microphones, and all necessary cables. Perfect for events up to 200 people.",
    category: "Sound & Lighting",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80"
    ],
    pricePerDay: 250,
    quantity: 5,
    availableQuantity: 5,
    features: [
      "2000W total power",
      "2 x 12-inch speakers",
      "Professional mixer with effects",
      "2 wireless microphones",
      "Bluetooth connectivity",
      "All cables included"
    ],
    specifications: "2000W professional sound system with dual 12-inch speakers. Frequency response: 40Hz - 20kHz. Includes 4-channel digital mixer with built-in effects, Bluetooth 5.0 connectivity, and 2 wireless microphones. Suitable for events up to 200 people.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.7,
    reviews: [],
    tags: ["sound system", "DJ", "audio", "speakers", "party"],
    depositAmount: 500
  },
  {
    name: "Elegant White Chiavari Chairs",
    description: "Classic white Chiavari chairs perfect for weddings and formal events. Lightweight yet sturdy, stackable for easy storage and transport.",
    category: "Furniture",
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80"
    ],
    pricePerDay: 8,
    quantity: 200,
    availableQuantity: 200,
    features: [
      "Classic Chiavari design",
      "White finish",
      "Stackable",
      "Weight capacity 250 lbs",
      "Cushion available upon request"
    ],
    specifications: "Made from high-quality resin with white finish. Seat height: 17 inches, Weight: 9 lbs, Maximum capacity: 250 lbs. Stackable design for easy storage and transport. Optional cushions available.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.6,
    reviews: [],
    tags: ["chairs", "wedding", "furniture", "seating", "chiavari"],
    depositAmount: 20
  },
  {
    name: "Professional Photo Booth with Props",
    description: "Complete photo booth setup with instant printing, digital sharing, and 50+ fun props. Includes attendant for full-day events.",
    category: "Photography",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
    ],
    pricePerDay: 350,
    quantity: 3,
    availableQuantity: 3,
    features: [
      "Instant photo printing",
      "Digital photo sharing via email/SMS",
      "50+ themed props included",
      "Custom photo templates",
      "Attendant included",
      "Unlimited prints"
    ],
    specifications: "Professional DSLR quality camera with 4x6 inch instant printing capability. Print speed: 10 seconds per photo. Booth size: 6x6 feet. Setup time: 30 minutes. Includes professional attendant, custom photo templates, and 50+ themed props. Digital sharing via email and SMS.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.9,
    reviews: [],
    tags: ["photo booth", "photography", "wedding", "party", "entertainment"],
    depositAmount: 300
  },
  {
    name: "Round Banquet Tables - 60 inch",
    description: "Sturdy 60-inch round banquet tables that seat 8-10 guests comfortably. Perfect for weddings, corporate events, and parties.",
    category: "Furniture",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
    ],
    pricePerDay: 15,
    quantity: 100,
    availableQuantity: 100,
    features: [
      "60-inch diameter",
      "Seats 8-10 guests",
      "Folding legs for easy transport",
      "Scratch-resistant surface",
      "Tablecloth available separately"
    ],
    specifications: "60-inch diameter round banquet table with 30-inch height. Made from durable plastic top with steel frame. Weight: 35 lbs. Folding legs for easy transport and storage. Seats 8-10 guests comfortably. Scratch-resistant surface.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.4,
    reviews: [],
    tags: ["tables", "banquet", "furniture", "seating", "round table"],
    depositAmount: 30
  },
  {
    name: "Floral Centerpiece Arrangements",
    description: "Beautiful handcrafted floral centerpieces with fresh flowers. Available in various color schemes to match your event theme.",
    category: "Decoration",
    images: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&q=80",
      "https://images.unsplash.com/photo-1522057384400-681b421cfebc?w=800&q=80"
    ],
    pricePerDay: 35,
    quantity: 40,
    availableQuantity: 40,
    features: [
      "Fresh flowers",
      "Custom color schemes",
      "Glass vase included",
      "12-inch height",
      "Professionally arranged"
    ],
    specifications: "Fresh floral centerpiece arrangements in glass cylinder vases. Height: 12 inches, Diameter: 10 inches. Custom color schemes available to match your event theme. Stays fresh for 2-3 days. Professionally arranged by experienced florists.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.9,
    reviews: [],
    tags: ["flowers", "centerpiece", "decoration", "wedding", "floral"],
    depositAmount: 75
  },
  {
    name: "Moving Head Stage Lights - 4 Pack",
    description: "Professional moving head LED stage lights with DMX control. Creates stunning lighting effects for concerts, parties, and events.",
    category: "Sound & Lighting",
    images: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80"
    ],
    pricePerDay: 180,
    quantity: 8,
    availableQuantity: 8,
    features: [
      "4 moving head lights",
      "DMX-512 control",
      "RGBW color mixing",
      "Multiple preset patterns",
      "Sound-activated mode",
      "Includes controller and cables"
    ],
    specifications: "Set of 4 professional moving head LED lights with 60W power per head. Beam angle: 13 degrees. RGBW color mixing with DMX-512 control. Multiple control modes including DMX, Sound-activated, and Auto. Weight: 8 lbs per head. Includes DMX controller and all necessary cables.",
    minimumRentalDays: 1,
    isAvailable: true,
    rating: 4.7,
    reviews: [],
    tags: ["lighting", "stage lights", "DMX", "party", "concert"],
    depositAmount: 400
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products (optional - comment out if you want to keep existing products)
    // await ProductModel.deleteMany({});
    // console.log('Cleared existing products');

    // Insert new products
    const result = await ProductModel.insertMany(products);
    console.log(`✅ Successfully seeded ${result.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
