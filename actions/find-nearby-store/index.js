// PLACEHOLDER — no real data configured for this tool yet.
// This is NOT real data. Replace MOCK_DATA with a real API call —
// see the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  {
    store_id: 'N/A',
    name: 'Sample Store — replace with real data',
    address: 'N/A',
    distance_km: 0,
    latitude: 0,
    longitude: 0,
    open_status: 'N/A',
    today_hours: 'N/A',
    phone: 'N/A',
    services: [],
    store_url: 'N/A',
    directions_url: 'N/A',
  },
];

module.exports = async ({
  postcode_or_suburb = '',
  required_service = '',
  open_at = '',
  maximum_distance_km = 0,
} = {}) => {
  if (!postcode_or_suburb || typeof postcode_or_suburb !== 'string' || !postcode_or_suburb.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a postcode_or_suburb to search near.' }],
      structuredContent: { stores: [] },
    };
  }

  const location = postcode_or_suburb.trim();
  const service = typeof required_service === 'string' ? required_service.trim().toLowerCase() : '';
  const maxDistance = typeof maximum_distance_km === 'number' && maximum_distance_km > 0
    ? maximum_distance_km
    : null;

  let results = MOCK_DATA.filter((store) => {
    if (service) {
      const services = Array.isArray(store.services) ? store.services : [];
      const hasService = services.some((s) => String(s).toLowerCase().includes(service));
      if (!hasService) return false;
    }
    if (maxDistance !== null && typeof store.distance_km === 'number' && store.distance_km > maxDistance) {
      return false;
    }
    return true;
  });

  // Sort nearest first, but keep open stores offering the requested service ahead
  // of a closer store that lacks it.
  results = results.slice().sort((a, b) => {
    const aOpen = String(a.open_status || '').toLowerCase().indexOf('closed') === -1 ? 0 : 1;
    const bOpen = String(b.open_status || '').toLowerCase().indexOf('closed') === -1 ? 0 : 1;
    if (aOpen !== bOpen) return aOpen - bOpen;
    return (a.distance_km || 0) - (b.distance_km || 0);
  });

  if (results.length === 0) {
    return {
      content: [{ type: 'text', text: `No Officeworks stores found near ${location}.` }],
      structuredContent: { stores: [] },
    };
  }

  const nearest = results[0];
  const summary = `Found ${results.length} Officeworks store${results.length === 1 ? '' : 's'} near ${location} —`
    + ` ${nearest.name} is the nearest match. Confirm the service or pickup option by phone before you visit.`;

  return {
    content: [{ type: 'text', text: summary }],
    // structuredContent.stores — derived from action name "find_nearby_store" (bare array outputSchema rule)
    structuredContent: { stores: results },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/stores?location=${postcode_or_suburb}&service=${required_service}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/stores?location=${encodeURIComponent(postcode_or_suburb)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
