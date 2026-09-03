// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
    {
        name: 'Acer Nitro V Gaming Laptop Ryzen 7 16GB/1TB RTX 4050',
        description: 'Windows 11 gaming laptop with Ryzen 7, 16GB RAM, 1TB storage and RTX 4050 graphics.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/acer-nitro-v-gaming-laptop-ryzen-7-16gb-1tb-rtx-4050-acntrsa005/media_157f82ac385b00e1523f27e88461b284f150f2de0.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$1,297.00',
        category: 'Technology'
    },
    {
        name: 'Asus 14" Zenbook Ryzen AI 5 16/512GB CoPilot+ PC',
        description: 'Premium 14-inch Zenbook with Ryzen AI 5, 16GB RAM and 512GB storage, Copilot+ ready.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/asus-14-zenbook-ryzen-ai-5-16-512gb-copilot-pc-aszbql017w/media_164eb7c3cf6455cae0f9a8f7f5e50673050aef28f.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$2,097.00',
        category: 'Technology'
    },
    {
        name: 'Asus 14" CM14 MTK540 4/64GB Chromebook',
        description: 'Compact 14-inch Chromebook with MediaTek processor, 4GB RAM and 64GB storage.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/asus-14-cm14-mtk540-4-64gb-chromebook-as4as60064/media_13843604fc5a7c020f9effa7af19b21048997b903.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$597.00',
        category: 'Technology'
    },
    {
        name: 'Ashton Electric Sit Stand Desk Riser Black',
        description: 'Electric height-adjustable sit-stand desk riser for ergonomic desktop working.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/ashton-electric-sit-stand-desk-riser-black-steldrsbk/media_114edb3441784ef0494e7f0d56ded53a5d454a5fa.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$349.00',
        category: 'Furniture'
    },
    {
        name: 'Ashton Executive Desk 1600mm',
        description: '1600mm executive office desk providing a spacious work surface.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/ashton-executive-desk-1600mm-jbashdsk/media_1f78871613fab43605b090cf2b3e2cd9079c20dd6.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$329.00',
        category: 'Furniture'
    },
    {
        name: 'Archer Chair Black',
        description: 'Black office chair for everyday desk and workspace seating.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/archer-chair-black-jbarchhbbk/media_169cacb4aba99633063e15e1d12a63a0e14d9db1d.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$139.00',
        category: 'Furniture'
    },
    {
        name: 'Bathurst V2 Racer Gaming Chair Red',
        description: 'Racer-style gaming chair in red with supportive ergonomic design.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/bathurst-v2-racer-gaming-chair-red-jbbat2chrd/media_17f561f111a99a02c14a74b666e8c46c194748839.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$135.00',
        category: 'Furniture'
    },
    {
        name: 'Artline 70 Permanent Markers Black 12 Pack',
        description: 'Bulk 12-pack of Artline 70 black permanent markers for office and labelling.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/artline-70-permanent-markers-black-12-pack-pa107001bk/media_1bc0c908cfdac9bdcf041b29d9f1382a8014e5af4.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$58.00',
        category: 'Office Supplies'
    },
    {
        name: 'Bic Cristal Ballpoint Pen 1mm Pastel 5 Pack',
        description: 'Five-pack of Bic Cristal 1mm ballpoint pens in pastel colours.',
        image_url: 'https://main--officeworks--mladobe.aem.live/products/bic-cristal-ballpoint-pen-1mm-pastel-5-pack-bi303125/media_1bf1123f3bc5df5ccb769cf4348d8625b075e2c5f.avif?width=1200&format=pjpg&optimize=medium',
        price: 'A$3.50',
        category: 'Office Supplies'
    }
]

function parsePrice(price) {
    if (typeof price === 'number') return price
    if (typeof price !== 'string') return 0
    const n = parseFloat(price.replace(/[^0-9.]/g, ''))
    return Number.isFinite(n) ? n : 0
}

module.exports = async ({
    workspace_type = '',
    number_of_people = 0,
    tasks = [],
    budget_max = null,
    space_description = '',
    existing_equipment = [],
    priorities = []
}) => {
    if (!workspace_type || typeof workspace_type !== 'string' || !workspace_type.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a workspace_type (e.g. home office, small business, classroom).' }],
            // structuredContent.products — bare array outputSchema; key derived from actionName "build_workspace_setup"
            structuredContent: { products: [] }
        }
    }
    if (!Number.isInteger(number_of_people) || number_of_people <= 0) {
        return {
            content: [{ type: 'text', text: 'Please provide number_of_people as a positive integer.' }],
            structuredContent: { products: [] }
        }
    }
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return {
            content: [{ type: 'text', text: 'Please provide at least one task the workspace must support.' }],
            structuredContent: { products: [] }
        }
    }

    const existing = (Array.isArray(existing_equipment) ? existing_equipment : [])
        .map((e) => String(e).toLowerCase())

    let results = MOCK_DATA.filter((item) => {
        if (existing.some((e) => e && item.name.toLowerCase().includes(e))) return false
        return true
    })

    const budget = typeof budget_max === 'number' && budget_max > 0 ? budget_max : null
    if (budget) {
        results = results.filter((item) => parsePrice(item.price) <= budget)
    }

    const estimatedBundleTotal = results.reduce((sum, item) => sum + parsePrice(item.price), 0)

    if (results.length === 0) {
        return {
            content: [{ type: 'text', text: `No Officeworks items matched the ${workspace_type} setup within the given constraints.` }],
            structuredContent: { products: [] }
        }
    }

    const budgetNote = budget
        ? ` The shortlist totals about A$${estimatedBundleTotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, within the A$${budget.toLocaleString('en-AU')} budget.`
        : ''

    const summary = `Here is a coordinated Officeworks setup for a ${number_of_people}-person ${workspace_type} — ${results.length} items.${budgetNote} Before purchasing, verify the room dimensions, desk and chair heights, and any ergonomic preferences (seat and monitor positioning, sit-stand range) against your available space. This is a shortlist, not a substitute for Officeworks' professional fit-out assessment.`

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.products — bare array outputSchema; key derived from actionName "build_workspace_setup"
        structuredContent: { products: results }
    }
}

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/products?category=furniture,technology,office-supplies
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the Officeworks product API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/products?budget=${encodeURIComponent(budget_max)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
