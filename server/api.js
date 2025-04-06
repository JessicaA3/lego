// api.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const PORT = 8092;
const MONGO_URI = 'mongodb+srv://JessicaA3:lego123@cluster0.x7swi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
module.exports = app;

app.use(express.json());
app.use(cors());
app.use(helmet());

let db;

MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db('lego_db');
    app.listen(PORT, () => console.log(`📡 Running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send({ ack: true });
});

// ROUTES ==============================
app.get('/deals/best-discount', async (req, res) => {
  const deals = await db.collection('deals').find({ discount: { $gte: 30 } }).sort({ discount: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/most-commented', async (req, res) => {
  const deals = await db.collection('deals').find().sort({ comments: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/price/asc', async (req, res) => {
  const deals = await db.collection('deals').find().sort({ price: 1 }).toArray();
  res.send(deals);
});

app.get('/deals/price/desc', async (req, res) => {
  const deals = await db.collection('deals').find().sort({ price: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/date/recent', async (req, res) => {
  const deals = await db.collection('deals').find().sort({ published: -1 }).toArray();
  res.send(deals);
});

app.get('/deals/date/oldest', async (req, res) => {
  const deals = await db.collection('deals').find().sort({ published: 1 }).toArray();
  res.send(deals);
});

app.get('/deals/hot', async (req, res) => {
  const deals = await db.collection('deals').find().sort({ temperature: -1 }).toArray();
  res.send(deals);
});

app.get('/sales/:id', async (req, res) => {
  const lego_id = req.params.id;
  const sales = await db.collection('sales').find({ lego_id }).toArray();
  res.send(sales);
});

app.get('/sales/recent', async (req, res) => {
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
  const sales = await db.collection('sales').find({ published: { $gte: threeWeeksAgo } }).sort({ published: -1 }).toArray();
  res.send(sales);
});

app.get('/sales/stats/:id', async (req, res) => {
  const lego_id = req.params.id;
  const sales = await db.collection('sales').find({ lego_id }).sort({ published: 1 }).toArray();

  if (sales.length === 0) return res.status(404).send({ error: 'No sales found' });

  const prices = sales.map(s => s.price).filter(p => typeof p === 'number').sort((a, b) => a - b);
  const getPercentile = p => prices[Math.floor((p / 100) * prices.length)] || 0;
  const lifetime = Math.ceil((new Date(sales[sales.length - 1].published) - new Date(sales[0].published)) / (1000 * 60 * 60 * 24));

  const stats = {
    number_of_sales: sales.length,
    average: prices.reduce((a, b) => a + b, 0) / prices.length,
    P5: getPercentile(5),
    P25: getPercentile(25),
    P50: getPercentile(50),
    lifetime_days: lifetime
  };

  res.send(stats);
});

