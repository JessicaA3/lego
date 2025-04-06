const fs = require('fs');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://JessicaA3:lego123@cluster0.x7swi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
const client = new MongoClient(MONGO_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db('lego_db');
    const dealsCollection = db.collection('deals');
    const salesCollection = db.collection('sales');

    // Insérer lego_deals.json
    const deals = JSON.parse(fs.readFileSync('./lego_deals2.json'));
    await dealsCollection.deleteMany({});
    await dealsCollection.insertMany(deals);
    console.log(`✅ ${deals.length} deals insérés`);

    // Insérer tous les fichiers Vinted
    const files = fs.readdirSync('.').filter(file => file.startsWith('vinted_') && file.endsWith('.json'));

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(file));
      const legoId = file.replace('vinted_', '').replace('.json', '');
      const enriched = data.map(item => ({ ...item, lego_id: legoId }));

      await salesCollection.insertMany(enriched);
      console.log(`✅ ${enriched.length} ventes insérées pour ${legoId}`);
    }

  } catch (err) {
    console.error('❌ Erreur lors du stockage MongoDB', err);
  } finally {
    await client.close();
  }
}

run();
