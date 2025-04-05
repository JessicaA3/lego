const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeVinted(legoSet) {
  const searchUrl = `https://www.vinted.fr/catalog?search=${encodeURIComponent(legoSet)}`;
  console.log(`🔍 Scraping Vinted for: ${legoSet}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  const sales = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.feed-grid__item')).map(item => {
      const titleElement = item.querySelector('.web_ui__ItemBox__title');
      const priceElement = item.querySelector('.web_ui__ItemBox__price');
      const linkElement = item.querySelector('a');
      const imageElement = item.querySelector('.web_ui__ItemBox__image img');

      return {
        title: titleElement ? titleElement.innerText.trim() : null,
        price: priceElement ? priceElement.innerText.trim() : null,
        link: linkElement ? 'https://www.vinted.fr' + linkElement.getAttribute('href') : null,
        image: imageElement ? imageElement.getAttribute('src') : null
      };
    });
  });

  await browser.close();

  console.log(`✅ ${sales.length} ventes trouvées !`);
  fs.writeFileSync('vinted_sales.json', JSON.stringify(sales, null, 2));
  console.log('📁 Données sauvegardées dans vinted_sales.json');
}

// Exécuter le script avec un set LEGO spécifique
scrapeVinted("lego 31213");
