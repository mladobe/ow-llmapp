const handler = require('../../actions/configure-print-project/index.js');

const validArgs = {
  project_type: 'business cards',
  quantity: 100,
  deadline: 'next week',
  postcode_or_suburb: '3000',
  finish_preferences: ['matte'],
  artwork_status: 'ready',
};

describe('configure_print_project handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler(validArgs);
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"set up an Officeworks Print and Create job" returns Print & Create options', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.projects.length).toBeGreaterThan(0);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.projects)).toBe(true);
  });

  test('returns error message when required project_type is missing', async () => {
    const out = await handler({ quantity: 100, deadline: 'next week', postcode_or_suburb: '3000' });
    expect(out.content[0].text).toMatch(/project_type|provide/i);
  });

  test('returns error message when required deadline is missing', async () => {
    const out = await handler({ project_type: 'flyers', postcode_or_suburb: '3000' });
    expect(out.content[0].text).toMatch(/deadline|provide/i);
  });

  test('returns error message when required postcode_or_suburb is missing', async () => {
    const out = await handler({ project_type: 'flyers', deadline: 'next week' });
    expect(out.content[0].text).toMatch(/postcode_or_suburb|provide/i);
  });

  test('unmatched project_type still returns available options rather than nothing', async () => {
    const out = await handler({ ...validArgs, project_type: 'holographic vinyl mural' });
    expect(Array.isArray(out.structuredContent.projects)).toBe(true);
    expect(out.structuredContent.projects.length).toBeGreaterThan(0);
  });
});
