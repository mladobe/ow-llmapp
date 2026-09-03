// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// Fixture is the action's samplePayload verbatim (real scraped Officeworks catalog data).
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

function findProduct(identifier) {
    const q = identifier.trim().toLowerCase();
    return MOCK_DATA.find((p) => p.name.toLowerCase() === q)
        || MOCK_DATA.find((p) => p.name.toLowerCase().includes(q))
        || null;
}

function priceToNumber(price) {
    if (typeof price === 'number') return price;
    if (typeof price !== 'string') return null;
    const n = parseFloat(price.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : null;
}

function normalizeProduct(item) {
    return {
        name: item.name,
        price: priceToNumber(item.price),
        stock_status: item.stock_status || 'Available online',
        key_features: Array.isArray(item.key_features)
            ? item.key_features
            : (item.description ? [item.description] : []),
        image_url: item.image_url,
        product_url: item.product_url || '',
    };
}

function buildDifferences(a, b) {
    const differences = [];
    const priceA = priceToNumber(a.price);
    const priceB = priceToNumber(b.price);
    if (priceA !== null && priceB !== null && priceA !== priceB) {
        const cheaper = priceA < priceB ? a.name : b.name;
        differences.push({
            attribute: 'Price',
            product_a_value: a.price,
            product_b_value: b.price,
            tradeoff: `${cheaper} costs less; the pricier option should justify the gap for your use case.`,
        });
    }
    if ((a.category || '') !== (b.category || '')) {
        differences.push({
            attribute: 'Category',
            product_a_value: a.category || 'N/A',
            product_b_value: b.category || 'N/A',
            tradeoff: 'The products sit in different catalogue categories.',
        });
    }
    return differences;
}

module.exports = async ({ product_a_identifier = '', product_b_identifier = '', use_case = '', postcode_or_suburb = '' }) => {
    if (!product_a_identifier || typeof product_a_identifier !== 'string' || !product_a_identifier.trim()
        || !product_b_identifier || typeof product_b_identifier !== 'string' || !product_b_identifier.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide both product_a_identifier and product_b_identifier to compare.' }],
            structuredContent: { products: [], differences: [], best_fit_summary: '' },
        };
    }
    if (!use_case || typeof use_case !== 'string' || !use_case.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a use_case so the comparison can be tailored.' }],
            structuredContent: { products: [], differences: [], best_fit_summary: '' },
        };
    }

    const itemA = findProduct(product_a_identifier);
    const itemB = findProduct(product_b_identifier);

    if (!itemA || !itemB) {
        const missing = [!itemA ? product_a_identifier : null, !itemB ? product_b_identifier : null].filter(Boolean).join(', ');
        return {
            content: [{ type: 'text', text: `Could not find a matching Officeworks product for: ${missing}.` }],
            structuredContent: { products: [], differences: [], best_fit_summary: '' },
        };
    }

    const products = [normalizeProduct(itemA), normalizeProduct(itemB)];
    const differences = buildDifferences(itemA, itemB);
    const best_fit_summary = `For "${use_case.trim()}", ${itemA.name} and ${itemB.name} each suit different priorities — weigh the ${differences.length} published difference(s) below against your budget and performance needs rather than treating either as an outright winner.`;

    // structuredContent — named-wrapper outputSchema: keys products/differences/best_fit_summary
    return {
        content: [{ type: 'text', text: `Comparing ${itemA.name} against ${itemB.name} for ${use_case.trim()}.` }],
        structuredContent: { products: products, differences: differences, best_fit_summary: best_fit_summary },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/products?q=${product_a_identifier}
 *   GET ${process.env.API_BASE_URL}/products?q=${product_b_identifier}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/products?q=${encodeURIComponent(product_a_identifier)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
