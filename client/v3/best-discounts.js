'use strict';

const API_URL = 'https://lego-g9ugb9z8g-jessicas-projects-0966b521.vercel.app';

/**
 * Fetch the top 5 best discount deals
 */
const fetchBestDiscountDeals = async () => {
  try {
    const res = await fetch(`${API_URL}/deals/best-discount`);
    const deals = await res.json();
    return deals.slice(0, 5); // Top 5 only
  } catch (err) {
    console.error('Failed to fetch best discounts:', err);
    return [];
  }
};

/**
 * Render the deal cards
 * @param {Array} deals
 */
const renderDeals = (deals) => {
  const container = document.getElementById('best-deals-container');
  container.innerHTML = '';

  deals.forEach(deal => {
    const card = document.createElement('div');
    card.className = 'deal-card best-deal-style';

    card.innerHTML = `
      <div class="deal-header">
        <span class="deal-id">ID: ${deal.id}</span>
      </div>
      <img src="${deal.image}" alt="${deal.title}" class="deal-image">
      <div class="deal-price-discount">
        <span class="deal-price">💰 ${deal.price}€</span>
        <span class="deal-discount">⬇️ -${deal.discount}%</span>
      </div>
      <div class="deal-temp-comments">
        <span class="deal-temperature">🔥 ${deal.temperature}°</span>
        <span class="deal-comments">💬 ${deal.comments} comments</span>
      </div>
      <a href="${deal.link}" target="_blank" class="view-deal-btn">Go to the offer</a>
    `;

    container.appendChild(card);
  });
};

// Initial load
(async () => {
  const topDeals = await fetchBestDiscountDeals();
  renderDeals(topDeals);
})();
