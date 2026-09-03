const handler = require('../../actions/track-order/index.js');

describe('track_order handler', () => {
  test('happy path — returns flat structuredContent for a known order', async () => {
    const res = await handler({ order_number: 'SAMPLE-ORDER' });

    expect(Array.isArray(res.content)).toBe(true);
    expect(res.content[0]).toMatchObject({ type: 'text' });
    expect(typeof res.content[0].text).toBe('string');
    expect(res.content[0].text.length).toBeGreaterThan(0);

    // Detail concept — structuredContent is a plain (flat) object, not an array
    expect(res.structuredContent).toBeInstanceOf(Object);
    expect(Array.isArray(res.structuredContent)).toBe(false);
    expect(res.structuredContent.order_number).toBe('SAMPLE-ORDER');
    expect(res.structuredContent.status).toBeDefined();
    expect(Array.isArray(res.structuredContent.milestones)).toBe(true);
  });

  test('missing required order_number returns a validation message', async () => {
    const res = await handler({});

    expect(Array.isArray(res.content)).toBe(true);
    expect(res.content[0].text).toMatch(/order_number/i);
    expect(res.structuredContent).toEqual({});
  });

  test('blank order_number is rejected', async () => {
    const res = await handler({ order_number: '   ' });

    expect(res.content[0].text).toMatch(/order_number/i);
    expect(res.structuredContent).toEqual({});
  });

  test('unknown order returns empty structuredContent object (not null)', async () => {
    const res = await handler({ order_number: 'OW000000-DOES-NOT-EXIST' });

    expect(Array.isArray(res.content)).toBe(true);
    expect(res.content[0].text).toMatch(/couldn't locate|could not locate/i);
    expect(res.structuredContent).toEqual({});
  });

  test('partial order number matches via includes fallback', async () => {
    const res = await handler({ order_number: 'SAMPLE' });

    expect(res.structuredContent.order_number).toBe('SAMPLE-ORDER');
  });
});
