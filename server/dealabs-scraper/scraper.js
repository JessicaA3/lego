const fetch = require('node-fetch');  // Pour faire des requêtes HTTP
const cheerio = require('cheerio');   // Pour manipuler le HTML
const fs = require('fs');             // Pour écrire un fichier JSON

// URL de la page des promotions LEGO sur Dealabs
const url = 'https://www.dealabs.com/groupe/lego';

/**
 * Fonction qui récupère et analyse la page des deals
 */
async function scrapeDeals() {
    try {
        // 1. Récupérer le contenu HTML de la page
        const response = await fetch(url);
        const body = await response.text();

        // 2. Charger le HTML avec cheerio
        const $ = cheerio.load(body);

        // 3. Extraire les deals
        let deals = [];

        $('.threadListCard').each((index, element) => {
            const title = $(element).find('.thread-title a').text().trim();
            const price = $(element).find('.text--b.size--all-xl').text().trim();
            const discount = $(element).find('.textBadge').text().trim();
            const link = $(element).find('.thread-title a').attr('href');

            // Vérifier que les valeurs existent
            if (title && price && link) {
                deals.push({
                    title,
                    price,
                    discount: discount || 'N/A',
                    link: 'https://www.dealabs.com' + link  // Compléter l'URL
                });
            }
        });

        // 4. Sauvegarder les deals dans un fichier JSON
        fs.writeFileSync('deals.json', JSON.stringify(deals, null, 2));
        console.log('Scraping terminé ! Les deals sont enregistrés dans deals.json');

    } catch (error) {
        console.error('Erreur lors du scraping :', error);
    }
}

// Lancer le scraping
scrapeDeals();

