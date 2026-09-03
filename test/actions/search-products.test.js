const handler = require('../../actions/search-products/index.js');

describe('search_products handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler({ query: 'laptop' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Find me Acer gaming laptops like the Nitro V" returns products', async () => {
    const out = await handler({ query: 'gaming laptop' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.products.length).toBeGreaterThan(0);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ query: 'laptop' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.products)).toBe(true);
  });

  test('returns error message when required query is missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/query|provide/i);
    expect(out.structuredContent.products).toEqual([]);
  });

  test('budget_max filters out products above the budget', async () => {
    const out = await handler({ query: 'chair', budget_max: 137 });
    const prices = out.structuredContent.products.map((p) => parseFloat(String(p.price).replace(/[^0-9.]/g, '')));
    expect(prices.every((p) => p <= 137)).toBe(true);
    expect(out.structuredContent.products.length).toBeGreaterThan(0);
  });

  test('preferred_brands narrows results to the requested brand', async () => {
    const out = await handler({ query: 'laptop', preferred_brands: ['Acer'] });
    expect(out.structuredContent.products.every((p) => /acer/i.test(p.name))).toBe(true);
  });

  test('query with no matches returns empty products and a no-results message', async () => {
    const out = await handler({ query: 'zzz-nonexistent-product' });
    expect(out.structuredContent.products).toEqual([]);
    expect(out.content[0].text).toMatch(/no .*products found/i);
  });
});
