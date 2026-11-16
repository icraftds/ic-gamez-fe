import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'

const ref = value => ({ value })
const computed = getter => ({ get value() { return getter() } })
const storage = () => {
    const data = new Map()
    return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)), removeItem: key => data.delete(key) }
}

const loadUseAdBanners = (api) => {
    const source = fs.readFileSync(new URL('../src/composables/useAdBanners.js', import.meta.url), 'utf8')
        .replace(/\r\n/g, '\n')
        .replace(/^import [^\n]*\n/gm, '')
        .replace(/export /g, '')
    const context = vm.createContext({
        ref,
        computed,
        api,
        sessionStorage: storage(),
        import: { meta: { env: {} } },
    })
    // Avoid `import.meta.env` syntax issues if needed by rewriting expression
    const cleanSource = source.replace(/import\.meta\.env\.VITE_BANNERS_ENDPOINT/g, 'undefined')
    vm.runInContext(cleanSource + '\nglobalThis.result = { useAdBanners }', context)
    return context.result.useAdBanners
}

test('useAdBanners fetches dynamic banners, filters schedule/placement, and sanitizes links', async () => {
    let calls = 0
    const api = {
        get: async (endpoint) => {
            calls++
            assert.equal(endpoint, '/banners')
            return {
                data: {
                    data: [
                        {
                            id: 'banner-2',
                            type_label: 'Sponsor Live',
                            title: 'Sponsor Prioritas 2',
                            description: 'Promo khusus dashboard',
                            cta_text: 'Lihat',
                            link: 'javascript:alert(1)',
                            accent_color: '#10b981',
                            placements: ['dashboard'],
                            priority: 2,
                            is_active: true,
                        },
                        {
                            id: 'banner-1',
                            type_label: 'Sponsor Utama',
                            title: 'Sponsor Prioritas 1',
                            description: 'Tampil pertama di semua halaman',
                            cta_text: 'Buka Pricing',
                            link: '/pricing',
                            accent_color: '#38bdf8',
                            placements: ['all'],
                            priority: 1,
                            is_active: true,
                        },
                        {
                            id: 'banner-off',
                            type_label: 'Off',
                            title: 'Nonaktif',
                            description: 'Tidak tampil',
                            cta_text: 'Tutup',
                            link: 'https://example.com',
                            placements: ['all'],
                            priority: 0,
                            is_active: false,
                        },
                    ],
                },
            }
        },
    }

    const useAdBanners = loadUseAdBanners(api)
    const { fetchBanners, getBannersForPlacement } = useAdBanners()
    await fetchBanners()
    assert.equal(calls, 1)

    // Subsequent calls without force=true reuse fetched banners cleanly
    await fetchBanners()
    assert.equal(calls, 1)

    const dashboardAds = getBannersForPlacement('dashboard').value
    assert.equal(dashboardAds.length, 2)
    assert.equal(dashboardAds[0].title, 'Sponsor Prioritas 1')
    assert.equal(dashboardAds[0].link, '/pricing')
    assert.equal(dashboardAds[1].title, 'Sponsor Prioritas 2')
    assert.equal(dashboardAds[1].link, '#')

    const landingAds = getBannersForPlacement('landing').value
    assert.equal(landingAds.length, 1)
    assert.equal(landingAds[0].title, 'Sponsor Prioritas 1')
})
