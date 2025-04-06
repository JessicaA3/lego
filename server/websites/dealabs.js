const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const parse = (html) => {
  const $ = cheerio.load(html);
  const deals = [];

  $('div.js-threadList article').each((i, el) => {
    try {
      const link = $(el).find('a[data-t="threadLink"]').attr('href');
      const fullLink = link?.startsWith('http') ? link : `https://www.dealabs.com${link}`;

      const vueData = $(el).find('div.js-vue2').attr('data-vue2');
      const threadData = vueData ? JSON.parse(vueData).props.thread : null;

      if (!threadData) return;

      const idMatch = threadData.title?.match(/\b\d{5}\b/);
      const id = idMatch ? idMatch[0] : null;

      deals.push({
        id,
        title: threadData.title || null,
        link: fullLink,
        price: threadData.price || null,
        retail: threadData.nextBestPrice || null,
        discount: threadData.price && threadData.nextBestPrice
          ? Math.round((1 - threadData.price / threadData.nextBestPrice) * 100)
          : null,
        temperature: threadData.temperature || null,
        comments: threadData.commentCount || 0,
        published: threadData.publishedAt
          ? new Date(threadData.publishedAt * 1000).toISOString()
          : null,
        image: threadData.mainImage
          ? `https://static-pepper.dealabs.com/threads/raw/${threadData.mainImage.slotId}/${threadData.mainImage.name}/re/300x300/qt/60/${threadData.mainImage.name}.${threadData.mainImage.ext}`
          : null,
      });
    } catch (e) {
      console.warn(`⚠️ Erreur sur un deal : ${e.message}`);
    }
  });

  return deals.filter((deal) => deal.id && /^\d{5}$/.test(deal.id));
};

const scrapePage = async (page = 1) => {
  const url = `https://www.dealabs.com/groupe/lego?page=${page}`;
  console.log(`📦 Scraping page ${page}: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'fr-FR,fr;q=0.9',
      Referer: 'https://www.google.com/',
    },
  });

  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  const html = await response.text();
  return parse(html);
};

const scrape = async () => {
  const pages = [1, 2]; // ← 2 pages ici
  let allDeals = [];

  for (const page of pages) {
    const deals = await scrapePage(page);
    allDeals = allDeals.concat(deals);
  }

  // Supprime les doublons par ID
  const uniqueDeals = Array.from(
    new Map(allDeals.map((deal) => [deal.id, deal])).values()
  );

  fs.writeFileSync('lego_deals2.json', JSON.stringify(uniqueDeals, null, 2), 'utf-8');
  console.log(`✅ ${uniqueDeals.length} deals enregistrés dans lego_deals2.json`);
};

scrape();
