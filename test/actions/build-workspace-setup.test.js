const handler = require('../../actions/build-workspace-setup/index.js')

const validArgs = {
    workspace_type: 'home office',
    number_of_people: 1,
    tasks: ['gaming', 'general office work'],
    budget_max: 2000
}

describe('build_workspace_setup handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler(validArgs)
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('"Build me a complete Officeworks setup for one person under two thousand dollars" returns a shortlist', async () => {
        const out = await handler(validArgs)
        expect(out.content[0].text.length).toBeGreaterThan(0)
        expect(out.structuredContent.products.length).toBeGreaterThan(0)
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler(validArgs)
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
        expect(Array.isArray(out.structuredContent.products)).toBe(true)
    })

    test('content note reminds shopper to verify measurements and ergonomics', async () => {
        const out = await handler(validArgs)
        expect(out.content[0].text).toMatch(/verify|dimension|ergonomic/i)
    })

    test('returns error message when workspace_type is missing', async () => {
        const out = await handler({ number_of_people: 1, tasks: ['work'] })
        expect(out.content[0].text).toMatch(/workspace_type|provide/i)
        expect(out.structuredContent.products).toEqual([])
    })

    test('returns error message when number_of_people is invalid', async () => {
        const out = await handler({ workspace_type: 'home office', number_of_people: 0, tasks: ['work'] })
        expect(out.content[0].text).toMatch(/number_of_people|provide/i)
    })

    test('returns error message when tasks is empty', async () => {
        const out = await handler({ workspace_type: 'home office', number_of_people: 1, tasks: [] })
        expect(out.content[0].text).toMatch(/task|provide/i)
    })

    test('respects budget_max — all returned items are within budget', async () => {
        const out = await handler({ ...validArgs, budget_max: 200 })
        const overBudget = out.structuredContent.products.filter((p) => {
            const n = parseFloat(String(p.price).replace(/[^0-9.]/g, ''))
            return n > 200
        })
        expect(overBudget).toHaveLength(0)
    })

    test('excludes existing_equipment from the shortlist', async () => {
        const out = await handler({ ...validArgs, budget_max: null, existing_equipment: ['Acer Nitro V'] })
        const hasLaptop = out.structuredContent.products.some((p) => p.name.includes('Acer Nitro V'))
        expect(hasLaptop).toBe(false)
    })

    test('returns empty products (not an error) when constraints match nothing', async () => {
        const out = await handler({ ...validArgs, budget_max: 0.01 })
        expect(out.structuredContent.products).toEqual([])
        expect(out.content[0].text).toMatch(/no .*matched|no officeworks/i)
    })
})
