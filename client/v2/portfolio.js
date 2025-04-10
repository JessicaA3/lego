// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
/*
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};
*/
const renderIndicators = pagination => {
  const {count, p5, p25, p50, lifetime} = pagination;

  spanNbDeals.innerHTML = count;
  document.querySelector('#p5').textContent = p5 ?? '–';
  document.querySelector('#p25').textContent = p25 ?? '–';
  document.querySelector('#p50').textContent = p50 ?? '–';
  document.querySelector('#lifetime').textContent = lifetime ?? '–';
};

/*
const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};*/

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
/*
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
}); */

// Listener pour changer le nombre de deals affichés
selectShow.addEventListener('change', async (event) => {
  const size = parseInt(event.target.value);
  const deals = await fetchDeals(1, size); // Revenir à la page 1
  setCurrentDeals(deals);
  render(currentDeals, currentPagination); // Mise à jour de l'affichage
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

// Listener pour changer de page
selectPage.addEventListener('change', async (event) => {
  const selectedPage = parseInt(event.target.value); // Page sélectionnée
  const size = parseInt(selectShow.value); // Taille actuelle
  const deals = await fetchDeals(selectedPage, size); // Appeler l'API avec les bons paramètres

  setCurrentDeals(deals); // Met à jour les données
  render(currentDeals, currentPagination); // Met à jour l'affichage
});

// Listener pour filtrer par ID de Lego set
selectLegoSetIds.addEventListener('change', () => {
  const selectedId = selectLegoSetIds.value;
  const filteredDeals = currentDeals.filter(deal => deal.id === selectedId);

  renderDeals(filteredDeals);
});


// Fonction render() inchangée
const render = (deals, pagination) => {
  renderDeals(deals); // Rendu des deals
  renderPagination(pagination); // Rendu des options de pagination
  renderIndicators(pagination); // Mise à jour des indicateurs
  renderLegoSetIds(deals); // Liste des IDs des sets Lego
};
