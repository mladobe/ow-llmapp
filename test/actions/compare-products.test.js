const handler = require('../../actions/compare-products/index.js');

const A = 'Acer Nitro V Gaming Laptop';
const B = 'Asus 14" Zenbook Ryzen AI 5';
const USE_CASE = 'home office coding and gaming';

describe('compare_products handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ product_a_identifier: A, product_b_identifier: B, use_case: USE_CASE });
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Compare the Acer Nitro V against the Asus Zenbook Ryzen AI 5" returns exactly two products', async () => {
        const out = await handler({ product_a_identifier: A, product_b_identifier: B, use_case: USE_CASE });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.products).toHaveLength(2);
        expect(out.structuredContent.products[0].name).toMatch(/Acer Nitro V/);
        expect(out.structuredContent.products[1].name).toMatch(/Zenbook/);
        expect(typeof out.structuredContent.best_fit_summary).toBe('string');
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ product_a_identifier: A, product_b_identifier: B, use_case: USE_CASE });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('returns an error hint when a required identifier is missing', async () => {
        const out = await handler({ product_a_identifier: A, use_case: USE_CASE });
        expect(out.content[0].text).toMatch(/product_b_identifier|provide/i);
    });

    test('returns an error hint when use_case is missing', async () => {
        const out = await handler({ product_a_identifier: A, product_b_identifier: B });
        expect(out.content[0].text).toMatch(/use_case|provide/i);
    });

    test('computes differences with a tradeoff for two differently-priced products', async () => {
        const out = await handler({ product_a_identifier: A, product_b_identifier: B, use_case: USE_CASE });
        const diffs = out.structuredContent.differences;
        expect(Array.isArray(diffs)).toBe(true);
        const priceDiff = diffs.find((d) => d.attribute === 'Price');
        expect(priceDiff).toBeDefined();
        expect(priceDiff.tradeoff.length).toBeGreaterThan(0);
    });

    test('unknown product returns empty products and a not-found message', async () => {
        const out = await handler({ product_a_identifier: 'Nonexistent Gadget 9000', product_b_identifier: B, use_case: USE_CASE });
        expect(out.content[0].text).toMatch(/could not find|not found/i);
        expect(out.structuredContent.products).toHaveLength(0);
    });
});
