const fetch = require("node-fetch");
const fs = require("fs");

const VINTED_API_URL = "https://www.vinted.fr/api/v2/catalog/items";
const BRAND_ID = "89162"; // ID de la marque LEGO
const STATUS_IDS = ["6", "1"]; // Neuf avec étiquette (6) + Neuf sans étiquette (1)
const PER_PAGE = 20;

// Remplace ces valeurs par les cookies que tu as récupérés
const sessionCookie = "Mzd6b0R4MDRKd3NWTkdWK2swR3J0OCtyZVRnbEhraG5Ra3pldmJCTGwwcGorSVdmYmxHZk9xbGNGK2h2TWJhaFFHU2tlTzNHZ0lmZnlGd080WW9tMkxRZDB3Vm1MdGxTS0kwNTVoRXRmUEVoWnRxamt4NTg0eW1kMllOQWthVUVWMnBkUHUrQ2NUZUNLWm9vZ2hxZ2EwUmp1dE53QkUxcUpHR3V3YVN2Tkg3L256R0xncE4zWUZGTFZvRFc0ak1kTkxhNVhOTGp6YWhqRUFPVkdKRkg1TTl2Vm5mYTBybUtGRWsybTNjREVJOTZFTVhpV0R1eGtwSjFVYTB3ZGwrdy0tTVMxUldZV1JqN3VXY3RnaXFCcXlpQT09--33f880d5daf1ca76a3bbacf348eb481ebd2327f7";  //ma valeur de cookie _vinted_fr_session
const anonIdCookie = "b3e8c894-3c6b-49cc-844a-920508e70c39";  // Remplace par la valeur de ton cookie anon_id
const accessTokenCookie = "eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjEyNDA5LCJzaWQiOiJmYzg3YTg5MS0xNzQxNjEyNDA5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MTk2MDksInB1cnBvc2UiOiJhY2Nlc3MifQ.KLRrU71FILCPvMNwLVCrP0Lv2VMxH1974V_TC3jvlWOUTp4AtW8IddNlP9QfCe4BHEc_7ovupkLMNB-rrFOA01FbG649id3aY8_fkY9k2zJKKJFhS1w-j1n1eLL4AnFjaM2ZBN241dWDONnQl88MHBJ39zUA6hdLmaYhaw5k350k7Yb7AKss9lChjCop4icHCbHd_EHT7AJrZrqip9fPOOxAl23dxI9PR6l2DmjUUJDCvPu-t8AVPJf769hiXldQRcPTV1bCLgqKq6JgJalEx66H8tA-Rq0bIBm1QGNc4v-5dO2akFEsClPA8VrrnI-71EXjCq6_bM3-ZWUr9VoYrw"; 
const refreshTokenCookie = "eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjEyNDA5LCJzaWQiOiJmYzg3YTg5MS0xNzQxNjEyNDA5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMTcyMDksInB1cnBvc2UiOiJyZWZyZXNoIn0.CVOZFmt4v-mtJTj8t8kyeICzgLG82X8qxzvGE9cJlaBxVUcheKDgfjuDeZm50LDYpd0I9kC7nX0kFcOFTaJnS3FkAg-p-CtkSEP-z2yCoOLyq08_kRmmh9iztSBhKfSSbCOyKaLJo0YuLRTiokz8JupjdQeZHRTjcEc3IMuZrxlHXRhH21L7Tx9icD85h5xAhMEIWpzERwpHViQyoJ6qAf_qBFBzXU9np8vGzbeDq_WKQcZvtIG_Xrwkc-gfPI_JbqqLTgBtrgMpeg5NRRcAsinB7uK5EFNrhBxkJyasr6Loik90-tVEkjh_F3yk14gk1QIFD13sFs_9xcf2Uv5wlQ"
async function getVintedSales(searchText = "42182", page = 1) {
    const url = `${VINTED_API_URL}?search_text=${searchText}&brand_ids[]=${BRAND_ID}&status_ids[]=${STATUS_IDS.join("&status_ids[]=")}&page=${page}&per_page=${PER_PAGE}`;

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": "https://www.vinted.fr/catalog",
        "Cookie": `${sessionCookie};${anonIdCookie}; ${accessTokenCookie}; ${refreshTokenCookie}` // Ajout des cookies nécessaires // Si tu as csrftoken, ajoute-le si nécessaire
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();

        // Vérifier si les données sont valides
        if (!data.items || data.items.length === 0) {
            console.log("Aucune annonce trouvée.");
            return [];
        }

        console.log(` ${data.items.length} annonces trouvées pour LEGO ${searchText}`);
        
        // Sauvegarde dans un fichier JSON
        const filename = `vinted_${searchText}.json`;
        fs.writeFileSync(filename, JSON.stringify(data.items, null, 2));

        console.log(`Les résultats ont été enregistrés dans ${filename}`);

        return data.items;
    } catch (error) {
        console.error("Erreur lors du scraping :", error);
        return [];
    }
}

// Export pour `sandbox.js`
module.exports = {
    scrape: getVintedSales
};
