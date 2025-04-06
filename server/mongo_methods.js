// mongo_methods.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://JessicaA3:lego123@cluster0.x7swi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("lego_db");

    const deals = db.collection("deals");
    const sales = db.collection("sales");

    // 1. Best discount deals
    const bestDiscount = await deals.find({ discount: { $gte: 30 } }).sort({ discount: -1 }).limit(5).toArray();
    console.log("🧱 Best discount deals:", bestDiscount);

    // 2. Most commented deals
    const mostCommented = await deals.find().sort({ comments: -1 }).limit(5).toArray();
    console.log("💬 Most commented deals:", mostCommented);

    // 3. Deals by price
    const byPrice = await deals.find().sort({ price: 1 }).limit(5).toArray();
    console.log("💲 Deals by price:", byPrice);

    // 4. Deals by date
    const byDate = await deals.find().sort({ published: -1 }).limit(5).toArray();
    console.log("🕒 Deals by date:", byDate);

    // 5. Sales for a given LEGO ID
    const legoSetId = "42154"; // Change as needed
    const salesForId = await sales.find({ lego_id: legoSetId }).toArray();
    console.log(`📦 Sales for ${legoSetId}:`, salesForId);

    // Méthode 6 : Trouver les ventes publiées il y a moins de 3 semaines
    async function findRecentSales(collection) {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
  
    const recentSales = await collection.find({
      published: { $gte: threeWeeksAgo }
    }).toArray();
  
    return recentSales;
  }
  

  } catch (err) {
    console.error("❌ Erreur:", err);
  } finally {
    await client.close();
  }
}

run();
