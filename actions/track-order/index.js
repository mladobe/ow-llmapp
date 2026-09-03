// PLACEHOLDER — no real data configured for this tool yet.
// This is NOT real data. Replace MOCK_DATA with a real API call —
// see the TODO block below the handler for endpoint details.
// (samplePayload for this action was a product catalog that does not match the
// order-tracking outputSchema, so it was treated as absent and a placeholder synthesized.)
const MOCK_DATA = [
  {
    order_number: 'SAMPLE-ORDER',
    status: 'Processing',
    fulfilment_method: 'N/A',
    milestones: [
      { label: 'Order placed', state: 'complete' },
      { label: 'Processing', state: 'current' },
      { label: 'Ready', state: 'upcoming' },
    ],
    latest_update: 'N/A',
    estimated_ready_or_delivery: 'N/A',
    store_name: 'N/A',
    delivery_summary: 'N/A',
    next_step: 'N/A',
    status_url: 'N/A',
  },
];

module.exports = async ({ order_number = '' } = {}) => {
  if (!order_number || typeof order_number !== 'string' || !order_number.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide an order_number to track.' }],
      structuredContent: {},
    };
  }

  const query = order_number.trim().toLowerCase();

  // TODO: Replace this MOCK_DATA lookup with a real order-tracking API call.
  const item = MOCK_DATA.find((o) => String(o.order_number).toLowerCase() === query)
    || MOCK_DATA.find((o) => String(o.order_number).toLowerCase().includes(query));

  if (!item) {
    return {
      content: [{ type: 'text', text: `We couldn't locate order ${order_number.trim()}. Please double-check the order number.` }],
      structuredContent: {},
    };
  }

  const summary = `Order ${item.order_number} is currently "${item.status}" (${item.fulfilment_method}).`
    + ' Here\'s what to expect next: follow the next step shown, and note that order status can change as the order progresses.';

  return {
    content: [{ type: 'text', text: summary }],
    // structuredContent — flat single-object detail shape (widget reads sc directly, no wrapper key)
    structuredContent: { ...item },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/orders/${order_number}/status
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's order-tracking API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/orders/${encodeURIComponent(order_number)}/status`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
