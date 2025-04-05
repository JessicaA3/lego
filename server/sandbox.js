/* eslint-disable no-console, no-process-exit */
const avenuedelabrique = require('./websites/avenuedelabrique');
const dealabs = require('./websites/dealabs');
const vinted = require('./websites/vinted'); // Ajout du module Vinted

async function sandbox(website) {
    try {
        console.log(`Browsing ${website} website...`);

        let deals;

        if (website.includes('avenuedelabrique')) {
            deals = await avenuedelabrique.scrape(website);
        } else if (website.includes('dealabs')) {
            deals = await dealabs.scrape(website);
        } else if (website.includes('vinted')) {  // Ajout de la gestion de Vinted
            deals = await vinted.scrape(website);
        } else {
            throw new Error('Site non pris en charge. Utilise Avenue de la Brique, Dealabs ou Vinted.');
        }

        console.log(deals);
        console.log('Done');
        process.exit(0);
    } catch (e) {
        console.error('Erreur:', e);
        process.exit(1);
    }
}

const [, , eshop] = process.argv;

sandbox(eshop || 'https://www.avenuedelabrique.com/nouveautes-lego');

