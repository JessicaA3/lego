const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const MONGO_URI = 'mongodb+srv://JessicaA3:lego123@cluster0.x7swi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(MONGO_URI);
  cachedDb = client.db('lego_db');
  return cachedDb;
}

app.get('/', (req, res) => {
  res.send({ ack: true });
});

// ===== DEALS ROUTES =====

app.get('/deals/best-discount', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find({ discount: { $gte: 30 } }).sort({ discount: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/most-commented', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find().sort({ comments: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/price/asc', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find().sort({ price: 1 }).toArray();
  res.send(deals);
});

app.get('/deals/price/desc', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find().sort({ price: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/date/recent', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find().sort({ published: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/date/oldest', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find().sort({ published: 1 }).toArray();
  res.send(deals);
});

app.get('/deals/hot', async (req, res) => {
  const db = await connectToDatabase();
  const deals = await db.collection('deals').find().sort({ temperature: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/search', async (req, res) => {
  const db = await connectToDatabase();
  const { limit = 12, price, date, filterBy } = req.query;
  const query = {};
  const sort = {};

  if (price) query.price = { $lte: parseFloat(price) };
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      query.published = { $gte: parsedDate };
    }
  }
  
  

  switch (filterBy) {
    case 'best-discount': sort.discount = -1; break;
    case 'most-commented': sort.comments = -1; break;
    case 'hot-deals': sort.temperature = -1; break;
    case 'price-asc': sort.price = 1; break;
    case 'price-desc': sort.price = -1; break;
    case 'date-asc': sort.published = 1; break;
    case 'date-desc': sort.published = -1; break;
    default: sort.price = 1;
  }

  const deals = await db.collection('deals').find(query).sort(sort).limit(parseInt(limit)).toArray();

  if (deals.length === 0) return res.status(404).send({ error: 'No deals match this query' });

  res.send({ limit: parseInt(limit), total: deals.length, results: deals });
});

// ===== SALES ROUTES =====

app.get('/sales/:id', async (req, res) => {
  const db = await connectToDatabase();
  const sales = await db.collection('sales').find({ lego_id: req.params.id }).toArray();
  res.send(sales);
});

app.get('/sales/recent', async (req, res) => {
  const db = await connectToDatabase();
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
  const sales = await db.collection('sales').find({ published: { $gte: threeWeeksAgo } }).sort({ published: -1 }).toArray();
  res.send(sales);
});

app.get('/sales/stats/:id', async (req, res) => {
  const db = await connectToDatabase();
  const sales = await db.collection('sales').find({ lego_id: req.params.id }).sort({ published: 1 }).toArray();
  if (sales.length === 0) return res.status(404).send({ error: 'No sales found' });

  const prices = sales.map(s => s.price).filter(p => typeof p === 'number').sort((a, b) => a - b);
  const getPercentile = p => prices[Math.floor((p / 100) * prices.length)] || 0;
  const lifetime = Math.ceil((new Date(sales[sales.length - 1].published) - new Date(sales[0].published)) / (1000 * 60 * 60 * 24));

  res.send({
    number_of_sales: sales.length,
    average: prices.reduce((a, b) => a + b, 0) / prices.length,
    P5: getPercentile(5),
    P25: getPercentile(25),
    P50: getPercentile(50),
    lifetime_days: lifetime
  });
});

app.get('/sales/search', async (req, res) => {
  const db = await connectToDatabase();
  const { limit = 12, legoSetId } = req.query;
  const query = {};
  if (legoSetId) query.lego_id = legoSetId;

  const sales = await db.collection('sales').find(query).sort({ published: -1 }).limit(parseInt(limit)).toArray();
  res.send({ limit: parseInt(limit), total: sales.length, results: sales });
});

// Vercel export
module.exports = app;
