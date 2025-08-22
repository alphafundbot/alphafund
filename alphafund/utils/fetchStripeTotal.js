// utils/fetchStripeTotal.js
/**
 * Fetches the current Stripe total from your FastAPI backend.
 * Returns an object with source, totalUSD (string), and currency.
 */
async function fetchStripeTotal() {
  try {
    const response = await fetch('/totals/stripe', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      source: data.source,
      totalUSD: parseFloat(data.total_usd).toFixed(2),
      currency: data.currency
    };
  } catch (error) {
    console.error('Error fetching Stripe total:', error);
    return null;
  }
}

export default fetchStripeTotal;
