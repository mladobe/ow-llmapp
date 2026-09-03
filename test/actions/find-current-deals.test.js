const handler = require('../../actions/find-current-deals/index.js')

describe('find_current_deals handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({})
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('"Find current Officeworks deals on markers and stationery" returns deals', async () => {
        const out = await handler({ query: 'markers' })
        expect(out.content[0].text.length).toBeGreaterThan(0)
        expect(out.structuredContent.deals.length).toBeGreaterThan(0)
        expect(out.structuredContent.deals.every((d) => /marker/i.test(`${d.name} ${d.category} ${d.description}`))).toBe(true)
    })

    test('with no filters returns the full deal list', async () => {
        const out = await handler({})
        expect(out.structuredContent.deals.length).toBe(9)
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({})
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
        expect(Array.isArray(out.structuredContent.deals)).toBe(true)
    })

    test('budget_max filters out deals above the given price', async () => {
        const out = await handler({ budget_max: 100 })
        expect(out.structuredContent.deals.length).toBeGreaterThan(0)
        expect(out.structuredContent.deals.every((d) => {
            const amount = parseFloat(String(d.price).replace(/[^0-9.]/g, ''))
            return isNaN(amount) || amount <= 100
        })).toBe(true)
    })

    test('a query with no matches returns an empty deals array and a helpful message', async () => {
        const out = await handler({ query: 'zzz-nonexistent-product' })
        expect(out.structuredContent.deals).toEqual([])
        expect(out.content[0].text).toMatch(/no current deals/i)
    })
})
