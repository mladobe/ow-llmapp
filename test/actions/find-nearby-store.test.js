const handler = require('../../actions/find-nearby-store/index.js');

describe('find_nearby_store handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler({ postcode_or_suburb: '4000' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Find an Officeworks store near Brisbane 4000" returns stores', async () => {
    const out = await handler({ postcode_or_suburb: 'Brisbane 4000' });
    expect(out.structuredContent.stores.length).toBeGreaterThan(0);
    expect(out.content[0].text.length).toBeGreaterThan(0);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ postcode_or_suburb: '4000' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('returns error message when required arg is missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/postcode_or_suburb|provide/i);
    expect(Array.isArray(out.structuredContent.stores)).toBe(true);
  });

  test('passes latitude/longitude through for the map surface', async () => {
    const out = await handler({ postcode_or_suburb: '4000' });
    const store = out.structuredContent.stores[0];
    expect(store).toHaveProperty('latitude');
    expect(store).toHaveProperty('longitude');
  });

  test('filters out stores that do not offer the required service', async () => {
    const out = await handler({ postcode_or_suburb: '4000', required_service: 'nonexistent service' });
    expect(out.structuredContent.stores.length).toBe(0);
    expect(out.content[0].text).toMatch(/no officeworks stores found/i);
  });
});
