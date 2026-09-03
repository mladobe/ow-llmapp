// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  { name: 'Acer Nitro V Gaming Laptop Ryzen 7 16GB/1TB RTX 4050', description: 'Windows 11 gaming laptop with Ryzen 7, 16GB RAM, 1TB storage and RTX 4050 graphics.', image_url: 'https://main--officeworks--mladobe.aem.live/products/acer-nitro-v-gaming-laptop-ryzen-7-16gb-1tb-rtx-4050-acntrsa005/media_157f82ac385b00e1523f27e88461b284f150f2de0.avif?width=1200&format=pjpg&optimize=medium', price: 'A$1,297.00', category: 'Technology' },
  { name: 'Asus 14" Zenbook Ryzen AI 5 16/512GB CoPilot+ PC', description: 'Premium 14-inch Zenbook with Ryzen AI 5, 16GB RAM and 512GB storage, Copilot+ ready.', image_url: 'https://main--officeworks--mladobe.aem.live/products/asus-14-zenbook-ryzen-ai-5-16-512gb-copilot-pc-aszbql017w/media_164eb7c3cf6455cae0f9a8f7f5e50673050aef28f.avif?width=1200&format=pjpg&optimize=medium', price: 'A$2,097.00', category: 'Technology' },
  { name: 'Asus 14" CM14 MTK540 4/64GB Chromebook', description: 'Compact 14-inch Chromebook with MediaTek processor, 4GB RAM and 64GB storage.', image_url: 'https://main--officeworks--mladobe.aem.live/products/asus-14-cm14-mtk540-4-64gb-chromebook-as4as60064/media_13843604fc5a7c020f9effa7af19b21048997b903.avif?width=1200&format=pjpg&optimize=medium', price: 'A$597.00', category: 'Technology' },
  { name: 'Ashton Electric Sit Stand Desk Riser Black', description: 'Electric height-adjustable sit-stand desk riser for ergonomic desktop working.', image_url: 'https://main--officeworks--mladobe.aem.live/products/ashton-electric-sit-stand-desk-riser-black-steldrsbk/media_114edb3441784ef0494e7f0d56ded53a5d454a5fa.avif?width=1200&format=pjpg&optimize=medium', price: 'A$349.00', category: 'Furniture' },
  { name: 'Ashton Executive Desk 1600mm', description: '1600mm executive office desk providing a spacious work surface.', image_url: 'https://main--officeworks--mladobe.aem.live/products/ashton-executive-desk-1600mm-jbashdsk/media_1f78871613fab43605b090cf2b3e2cd9079c20dd6.avif?width=1200&format=pjpg&optimize=medium', price: 'A$329.00', category: 'Furniture' },
  { name: 'Archer Chair Black', description: 'Black office chair for everyday desk and workspace seating.', image_url: 'https://main--officeworks--mladobe.aem.live/products/archer-chair-black-jbarchhbbk/media_169cacb4aba99633063e15e1d12a63a0e14d9db1d.avif?width=1200&format=pjpg&optimize=medium', price: 'A$139.00', category: 'Furniture' },
  { name: 'Bathurst V2 Racer Gaming Chair Red', description: 'Racer-style gaming chair in red with supportive ergonomic design.', image_url: 'https://main--officeworks--mladobe.aem.live/products/bathurst-v2-racer-gaming-chair-red-jbbat2chrd/media_17f561f111a99a02c14a74b666e8c46c194748839.avif?width=1200&format=pjpg&optimize=medium', price: 'A$135.00', category: 'Furniture' },
  { name: 'Artline 70 Permanent Markers Black 12 Pack', description: 'Bulk 12-pack of Artline 70 black permanent markers for office and labelling.', image_url: 'https://main--officeworks--mladobe.aem.live/products/artline-70-permanent-markers-black-12-pack-pa107001bk/media_1bc0c908cfdac9bdcf041b29d9f1382a8014e5af4.avif?width=1200&format=pjpg&optimize=medium', price: 'A$58.00', category: 'Office Supplies' },
  { name: 'Bic Cristal Ballpoint Pen 1mm Pastel 5 Pack', description: 'Five-pack of Bic Cristal 1mm ballpoint pens in pastel colours.', image_url: 'https://main--officeworks--mladobe.aem.live/products/bic-cristal-ballpoint-pen-1mm-pastel-5-pack-bi303125/media_1bf1123f3bc5df5ccb769cf4348d8625b075e2c5f.avif?width=1200&format=pjpg&optimize=medium', price: 'A$3.50', category: 'Office Supplies' },
];

// Parse a price that may be a number or a formatted string like "A$1,297.00".
function priceToNumber(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const n = parseFloat(price.replace(/[^0-9.]/g, ''));
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

module.exports = async ({
  query = '',
  budget_max,
  preferred_brands = [],
  postcode_or_suburb = '',
  fulfilment_preference = '',
}) => {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a query describing the product, category, or task you need help with.' }],
      structuredContent: { products: [] },
    };
  }

  const q = query.trim().toLowerCase();
  const brands = Array.isArray(preferred_brands)
    ? preferred_brands.map((b) => String(b).toLowerCase())
    : [];

  const results = MOCK_DATA.filter((item) => {
    const haystack = `${item.name || ''} ${item.description || ''} ${item.category || ''}`.toLowerCase();
    if (!haystack.includes(q)) return false;
    if (typeof budget_max === 'number') {
      const p = priceToNumber(item.promotional_price !== undefined ? item.promotional_price : item.price);
      if (p !== null && p > budget_max) return false;
    }
    if (brands.length > 0) {
      const name = `${item.brand || ''} ${item.name || ''}`.toLowerCase();
      if (!brands.some((b) => name.includes(b))) return false;
    }
    return true;
  });

  if (results.length === 0) {
    return {
      content: [{ type: 'text', text: `No Officeworks products found matching "${query}". Try a broader search or a different budget.` }],
      // structuredContent.products — bare array outputSchema; key derived from actionName "search_products"
      structuredContent: { products: [] },
    };
  }

  const bits = [`Found ${results.length} Officeworks product${results.length === 1 ? '' : 's'} matching "${query}"`];
  if (typeof budget_max === 'number') bits.push(`within a A$${budget_max} budget`);
  if (brands.length > 0) bits.push(`from ${preferred_brands.join(', ')}`);
  if (postcode_or_suburb) bits.push(`near ${postcode_or_suburb}`);
  if (fulfilment_preference) bits.push(`with ${fulfilment_preference}`);
  const summary = `${bits.join(' ')} — the carousel shows how each option fits your use case and price range.`;

  return {
    content: [{ type: 'text', text: summary }],
    // structuredContent.products — bare array outputSchema; key derived from actionName "search_products"
    structuredContent: { products: results },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/products?q=${query}&budget=${budget_max}&postcode=${postcode_or_suburb}
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
 *     `${process.env.API_BASE_URL}/products?q=${encodeURIComponent(query)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
