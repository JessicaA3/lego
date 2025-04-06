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

    // 3. Cheapest to most expensive
    const byPrice = await deals.find().sort({ price: 1 }).limit(5).toArray();
    console.log("💲 Deals by price (cheap → expensive):", byPrice);

    // 4. Most expensive to cheapest
    const mostExpensive = await deals.find().sort({ price: -1 }).limit(5).toArray();
    console.log("💰 Deals by price (expensive → cheap):", mostExpensive);

    // 5. Recently published
    const byDate = await deals.find().sort({ published: -1 }).limit(5).toArray();
    console.log("🕒 Recently published deals:", byDate);

    // 6. Oldest published
    const oldestDeals = await deals.find().sort({ published: 1 }).limit(5).toArray();
    console.log("📜 Oldest deals:", oldestDeals);

    // 7. Hot deals by temperature
    const hotDeals = await deals.find().sort({ temperature: -1 }).limit(5).toArray();
    console.log("🔥 Hot deals:", hotDeals);

    // 8. Sales for a given LEGO ID
    const legoSetId = "10300"; // à modifier pour tester d'autres IDs
    const salesForId = await sales.find({ lego_id: legoSetId }).toArray();
    console.log(`📦 Sales for ${legoSetId}:`, salesForId);

    // 9. Recent sales (less than 3 weeks old)
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    const recentSales = await sales.find({
      published: { $gte: threeWeeksAgo }
    }).sort({ published: -1 }).toArray();

    console.log(`🕒 ${recentSales.length} ventes récentes (moins de 3 semaines):`, recentSales);

    // 10. Indicators (stats) for a given LEGO ID
    const result = await sales.find({ lego_id: legoSetId }).sort({ published: 1 }).toArray();

    if (result.length === 0) {
      console.log("❌ Aucune vente trouvée pour cet ID.");
    } else {
      const prices = result
        .map(s => s.price)
        .filter(p => typeof p === 'number')
        .sort((a, b) => a - b);

      const getPercentile = (p) => {
        const idx = Math.floor((p / 100) * prices.length);
        return prices[idx] || 0;
      };

      const stats = {
        number_of_sales: result.length,
        average: prices.reduce((a, b) => a + b, 0) / prices.length,
        P5: getPercentile(5),
        P25: getPercentile(25),
        P50: getPercentile(50),
        lifetime_days: Math.ceil((new Date(result[result.length - 1].published) - new Date(result[0].published)) / (1000 * 60 * 60 * 24))
      };

      console.log(`📊 Stats pour le set ${legoSetId} :`, stats);
    }

  } catch (err) {
    console.error("❌ Erreur:", err);
  } finally {
    await client.close();
  }
}

run();
