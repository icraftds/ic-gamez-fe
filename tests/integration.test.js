import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { webcrypto } from 'node:crypto'

const ref = value => ({ value })
const computed = getter => ({ get value() { return getter() } })
const storage = () => {
  const data = new Map()
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)), removeItem: key => data.delete(key) }
}
const onMounted = fn => { if (typeof fn === 'function') fn() }
const load = (path, names, globals) => {
  let source = fs.readFileSync(new URL(path, import.meta.url), 'utf8')
  if (path.endsWith('.vue')) source = source.match(/<script setup>([\s\S]*?)<\/script>/)[1]
  source = source.replace(/\r\n/g, '\n').replace(/^import [^\n]*\n/gm, '').replace(/export /g, '')
  const context = vm.createContext({ ref, computed, onMounted, console, ssoEnabled: false, ...globals })
  vm.runInContext(source + `\nglobalThis.result = { ${names} }`, context)
  return context.result
}

test('Wallet zero is fresh, outage preserves balance/session, initializer deduplicates', async () => {
  const localStorage = storage(); localStorage.setItem('auth_token', 'SSO')
  let fail = false, initialized = 0, walletCalls = 0
  const api = {
    get: async (url, options) => {
      if (url === '/auth/me') return { data: { data: { id: 7, name: 'Buyer', created_at: '2026-01-01', current_plan: 'free' } } }
      assert.equal(options.params.include_histories, 0); walletCalls++
      if (fail) throw { response: { status: 503 } }
      return { data: { data: { balance: 0 } } }
    },
    post: async (url, body) => { assert.equal(url, '/user/wallet/initialize'); assert.deepEqual(Object.keys(body), []); initialized++ }
  }
  const { useUserAccount } = load('../src/composables/useUserAccount.js', 'useUserAccount', { api, localStorage, initCsrf: async () => {} })
  const account = useUserAccount()
  await Promise.all([account.bootstrapSession(), account.bootstrapSession()])
  assert.equal(initialized, 1); assert.equal(walletCalls, 1)
  assert.equal(account.coinz.value, 0); assert.equal(account.walletStatus.value, 'fresh')
  fail = true; await account.fetchWallet()
  assert.equal(account.coinz.value, 0); assert.equal(account.walletStatus.value, 'stale'); assert.equal(account.isLoggedIn.value, true)
})

test('Energy retry after timeout and reload generates fresh UUID and blocks double submit', async () => {
  const localStorage = storage(), keys = []
  let fail = true, release
  const api = { post: async (url, body, options) => {
    assert.equal(url, '/shop/purchase/coinz'); assert.equal(body.package_id, '2')
    keys.push(options.headers['Idempotency-Key'])
    if (fail) { await new Promise(resolve => { release = resolve }); throw { response: { status: 503 } } }
    return { data: { success: true } }
  } }
  const globals = {
    api, localStorage, crypto: webcrypto,
    setTimeout: fn => { if (typeof fn === 'function') fn(); return 1 },
    onBeforeRouteLeave: () => {},
    useLearningPaths: () => ({ fetchPaths: async () => {} }),
    useRouter: () => ({ push: () => {} }),
    useRoute: () => ({ query: { pkgId: '2', method: 'coinz' } }),
    useUserAccount: () => ({ userProfile: ref({ id: 7 }), coinz: ref(0), systemConfig: ref({}), fetchPublicConfig: async () => {}, fetchUser: async () => {}, fetchWallet: async () => {} })
  }
  let checkout = load('../src/views/ShopCheckoutView.vue', 'processPayment, state', globals)
  const pending = checkout.processPayment(); await checkout.processPayment(); assert.equal(keys.length, 1)
  release(); await pending
  fail = false
  await checkout.processPayment()
  assert.equal(checkout.state.value, 'success')
})

test('Unauthenticated user cannot process coinz payment', async () => {
  const localStorage = storage()
  let called = false
  const checkout = load('../src/views/ShopCheckoutView.vue', 'processPayment, errorMsg', {
    api: { post: async () => { called = true } }, localStorage, crypto: webcrypto,
    setTimeout: fn => { if (typeof fn === 'function') fn(); return 1 },
    onBeforeRouteLeave: () => {},
    useLearningPaths: () => ({ fetchPaths: async () => {} }),
    useRouter: () => ({ push: () => {} }),
    useRoute: () => ({ query: { pkgId: '2', method: 'coinz' } }),
    useUserAccount: () => ({ userProfile: ref(null), coinz: ref(0), systemConfig: ref({}), fetchPublicConfig: async () => {} })
  })
  await checkout.processPayment(); assert.equal(called, false); assert.match(checkout.errorMsg.value, /masuk kembali/)
})

test('Poll backs off, stops at two minutes and disposes visibility listener', async () => {
  let now = 0, timer, listener, checks = 0, timedOut = false
  const { createPaymentPoll } = load('../src/utils/paymentPoll.js', 'createPaymentPoll', {
    Date: { now: () => now }, document: { hidden: false, addEventListener: (_, fn) => { listener = fn }, removeEventListener: () => { listener = null } },
    setTimeout: (fn, delay) => { timer = { fn, delay }; return 1 }, clearTimeout: () => { timer = null }
  })
  const poll = createPaymentPoll(async () => { checks++; return false }, { onTimeout: () => { timedOut = true } })
  poll.start(); await new Promise(resolve => setImmediate(resolve)); assert.equal(timer.delay, 3000)
  while (timer) { const next = timer; timer = null; now += next.delay; await next.fn() }
  assert.equal(now, 120000); assert.equal(timedOut, true); assert.ok(checks < 15)
  poll.dispose(); assert.equal(listener, null)
})

test('Paid Pro uses product invoice contract and leaves subscription activation to backend', async () => {
  const localStorage = storage(), calls = [], emitted = []
  const props = { planSlug: 'pro', rawPrice: 1, planId: 999 }
  const api = {
    get: async url => ({ data: { data: url === '/plans' ? [{ id: 2, slug: 'pro', is_active: true, price: 49000 }] : null } }),
    post: async (url, body) => { calls.push({ url, body }); return { data: { data: { order_id: 'ORDER', payment_details: { qr_string: 'QR' } } } } }
  }
  const checkout = load('../src/components/checkout/CheckoutStepSelection.vue', 'goToInstruction', {
    api, localStorage,
    setTimeout: fn => { if (typeof fn === 'function') fn(); return 1 },
    resolvePlanPresentation: () => ({ checkoutBadge: 'Paling Populer', durationLabel: '30 Hari', energyLabel: '20 Energi/minggu', features: [] }),
    useUserAccount: () => ({ userProfile: ref({ id: 7 }) }), defineProps: () => props, defineEmits: () => (...args) => emitted.push(args)
  })
  await checkout.goToInstruction()
  assert.equal(calls.length, 1); assert.equal(calls[0].url, '/payments/create')
  assert.deepEqual(Object.keys(calls[0].body).sort(), ['coupon_code', 'duration_months', 'item_type', 'payment_method', 'plan_slug'])
  assert.equal(emitted.some(([event]) => event === 'success'), false)
  assert.equal(emitted.find(([event]) => event === 'instruction')[1].paymentDetails.order_id, 'ORDER')
})

test('resolvePlanPresentation resolves dynamic benefits, badge, energy label, and sessionStorage cache', async () => {
  const sessionStorage = storage()
  const api = {
    get: async () => ({
      data: {
        data: [
          {
            slug: 'pro',
            duration_in_days: 30,
            badge_label: 'Best Seller',
            energy_label: '30 Energi/minggu',
            benefits: [
              { text: 'Pilih 15 modul', included: true },
              { text: 'Mentoring 1-on-1', included: false }
            ]
          }
        ]
      }
    })
  }
  const { usePlans, resolvePlanPresentation } = load('../src/composables/usePlans.js', 'usePlans, resolvePlanPresentation', {
    api, sessionStorage
  })
  const { fetchPlans, findPlanBySlug } = usePlans()
  await fetchPlans()
  const proPlan = findPlanBySlug('pro')
  assert.ok(proPlan)
  assert.ok(sessionStorage.getItem('ic_plans_cache_v1'))

  const dynamic = resolvePlanPresentation(proPlan, 3)
  assert.equal(dynamic.badgeLabel, 'Best Seller')
  assert.equal(dynamic.energyLabel, '30 Energi/minggu')
  assert.equal(dynamic.durationLabel, '90 Hari')
  assert.deepEqual(dynamic.features, ['Pilih 15 modul'])
  assert.deepEqual(dynamic.disabledFeatures, ['Mentoring 1-on-1'])

  const fallback = resolvePlanPresentation({ slug: 'pro', max_selectable_modules: 14, icoinz_reward: 50000 }, 1)
  assert.equal(fallback.badgeLabel, 'Paling Populer')
  assert.equal(fallback.energyLabel, '20 Energi/minggu')
  assert.match(fallback.features[0], /14 modul/)
  assert.match(fallback.features[1], /50\.000 iCoinZ/)
})

test.skip('Invoice timeout cannot create another invoice after retry or reload', async () => {
  const localStorage = storage(); let invoices = 0
  const globals = {
    localStorage, useUserAccount: () => ({ userProfile: ref({ id: 7 }) }),
    defineProps: () => ({ planSlug: 'pro' }), defineEmits: () => () => {},
    api: {
      get: async url => ({ data: { data: url === '/plans' ? [{ id: 2, slug: 'pro', is_active: true, price: 49000 }] : null } }),
      post: async () => { invoices++; throw { response: { status: 503, data: {} } } }
    }
  }
  let checkout = load('../src/components/checkout/CheckoutStepSelection.vue', 'goToInstruction', globals)
  await checkout.goToInstruction(); await checkout.goToInstruction()
  checkout = load('../src/components/checkout/CheckoutStepSelection.vue', 'goToInstruction', globals)
  await checkout.goToInstruction(); assert.equal(invoices, 1)
})

test('Provider return and previous Pro grant do not prove the new payment fulfilled', async () => {
  const localStorage = storage(); let subscriptionId = 1, check, walletRefreshes = 0
  localStorage.setItem('ic_pending_checkout', JSON.stringify({ userId: 7, planSlug: 'pro', paymentDetails: { baselineSubscription: { id: 1, expires_at: '2026-11-01' } } }))
  const page = load('../src/views/PaymentSuccessView.vue', 'isSuccess', {
    localStorage, onMounted: () => {}, onUnmounted: () => {}, useRouter: () => ({ push: () => {} }), useRoute: () => ({ query: { status: 'completed' } }),
    createPaymentPoll: fn => { check = fn; return { start() {}, stop() {}, dispose() {} } },
    useUserAccount: () => ({ userProfile: ref({ id: 7 }), isLoggedIn: ref(true), currentPlan: ref('pro'), isPremiumUser: ref(true), fetchUser: async () => ({ id: 7 }), fetchWallet: async () => { walletRefreshes++ } }),
    api: { get: async () => ({ data: { data: { id: subscriptionId, status: 'active', expires_at: '2026-11-01' } } }) }
  })
  assert.equal(await check(() => true), false); assert.equal(page.isSuccess.value, false)
  subscriptionId = 2
  // Cancelled page must not report fulfillment even if the request just succeeded.
  assert.equal(await check(() => false), false); assert.equal(walletRefreshes, 0)
})

test('P0-1: useDashboardStats deduplicates in-flight/TTL requests and path badges match access status', async () => {
  let statsCalls = 0
  let nowMs = 1000
  const api = {
    get: async (url) => {
      if (url === '/user/statistics') {
        statsCalls++
        return { data: { data: { xp: { total: 643, level: 2, next_level_xp: 2000 }, completed_exercises: { total: 42 } } } }
      }
      return { data: { data: [] } }
    }
  }
  const FakeDate = { now: () => nowMs }
  const { useDashboardStats, invalidateStatsCache } = load(
    '../src/composables/useDashboardStats.js',
    'useDashboardStats, invalidateStatsCache',
    { api, Date: FakeDate }
  )

  const storeA = useDashboardStats()
  const storeB = useDashboardStats()
  await Promise.all([storeA.fetchStats(), storeB.fetchStats()])
  assert.equal(statsCalls, 1)
  assert.equal(storeA.statsData.value.xp.total, 643)

  // Subsequent mount within 30s TTL reuses cached stats without hitting network.
  nowMs += 5000
  await storeA.fetchStats()
  assert.equal(statsCalls, 1)

  // Invalidation (e.g. after completing a lesson) forces fresh reload.
  invalidateStatsCache()
  await storeA.fetchStats()
  assert.equal(statsCalls, 2)

  const { getPathAccessBadge } = await import('../src/utils/pathTheme.js')
  assert.equal(getPathAccessBadge({ is_premium: true, access_status: 'owned' }), 'DIMILIKI')
  assert.equal(getPathAccessBadge({ is_premium: true, access_status: 'pro_quota' }), 'PRO KUOTA')
  assert.equal(getPathAccessBadge({ is_premium: true, access_status: 'expert_full' }), 'EXPERT')
  assert.equal(getPathAccessBadge({ is_premium: true, access_status: 'locked' }), 'PRO')
})

test('P0-4 & P0-3: JS runner supports top-level await, custom input const, and multi-case hidden validation', async () => {
  const { runJavascript } = await import('../src/utils/runners/javascriptRunner.js')
  const { validateStdout } = await import('../src/utils/validators/StdoutValidator.js')
  const { validateDom } = await import('../src/utils/validators/DomValidator.js')
  const { extractTestCases, extractTestInput, parsePracticeData, serializeTestInput, stripCommentsByLanguage } = await import('../src/utils/runners/testInputHelper.js')

  // Top-level async/await (e.g. Alur 13 3.1)
  const asyncOut = await runJavascript(`
    function fetchUser() { return new Promise(resolve => resolve("Budi")); }
    const user = await fetchUser();
    console.log(user);
  `)
  assert.equal(asyncOut.some(e => e.type === 'error'), false)
  assert.equal(asyncOut[0].text, 'Budi')

  // User declaring const input must not trigger SyntaxError
  const customInputOut = await runJavascript(`
    const input = [10, 20];
    console.log(input.reduce((a, b) => a + b, 0));
  `, { test_cases: [{ input: '["ignored"]', expected_output: '30' }] })
  assert.equal(customInputOut.some(e => e.type === 'error'), false)
  assert.equal(customInputOut[0].text, '30')

  // JSON-quoted string expected output must accept plain printed string (P0-2)
  assert.equal(validateStdout([{ type: 'log', text: 'Mobil Toyota siap digunakan' }], '"Mobil Toyota siap digunakan"'), true)

  // Hidden test case validator rejects hardcoded solutions without leaking hidden expected output (P0-3)
  const { runValidation } = load('../src/utils/validators/index.js', 'runValidation', {
    validateStdout,
    validateSqlResult: async () => true,
    validateDom,
    extractTestCases,
    stripCommentsByLanguage,
    executeCode: async (lang, code, ctx) => runJavascript(code, ctx),
  })
  const cases = [
    { input: '[7, 2, 9, 4, 1]', expected_output: '[1, 2, 4, 7, 9]', is_hidden: false },
    { input: '[5, 3, 8]', expected_output: '[3, 5, 8]', is_hidden: true },
  ]
  const hardcodedCode = 'console.log([1, 2, 4, 7, 9]);'
  const firstRunOutput = await runJavascript(hardcodedCode, { test_cases: [cases[0]] })
  const hardcodedPassed = await runValidation('stdout', cases, firstRunOutput, hardcodedCode, { language: 'javascript' })
  assert.equal(hardcodedPassed, false)
  assert.equal(firstRunOutput.some(e => e.type === 'error' && /hidden test case/i.test(e.text) && !e.text.includes('[3, 5, 8]')), true)

  const dynamicCode = 'function bubbleSort(arr) { return [...arr].sort((a, b) => a - b); }\nconsole.log(JSON.stringify(bubbleSort(input)));'
  const dynamicFirstOutput = await runJavascript(dynamicCode, { test_cases: [cases[0]] })
  const dynamicPassed = await runValidation('stdout', cases, dynamicFirstOutput, dynamicCode, { language: 'javascript' })
  assert.equal(dynamicPassed, true)

  // Python runner auto-invokes solve/function_name & avoids clobbering input() calls
  const executedScripts = []
  let stdoutHandler = null
  const mockPyodide = {
    setStdout: ({ batched }) => { stdoutHandler = batched },
    setStderr: () => {},
    runPythonAsync: async (script) => {
      executedScripts.push(script)
      if (script.includes('__ic_fn = globals().get') && stdoutHandler) {
        stdoutHandler('Mobil Toyota siap digunakan')
      }
    }
  }
  const { runPython } = load('../src/utils/runners/pythonRunner.js', 'runPython', {
    extractTestInput,
    parsePracticeData,
    serializeTestInput,
    stripCommentsByLanguage,
    window: { loadPyodide: async () => mockPyodide }
  })
  const pyOut = await runPython(
    'def solve(x):\n    return "Mobil Toyota siap digunakan"',
    { function_name: 'solve', test_cases: [{ input: 'Toyota', expected_output: '"Mobil Toyota siap digunakan"' }] }
  )
  assert.equal(executedScripts.some(s => s.includes('__ic_fn = globals().get("solve")')), true)
  assert.equal(executedScripts.some(s => s.includes('print("null")')), true)
  assert.equal(pyOut[0].text, 'Mobil Toyota siap digunakan')

  // When code uses built-in input(...), runner must not rebind `input = __ic_test_input`
  const executedStdinScripts = []
  mockPyodide.runPythonAsync = async (script) => { executedStdinScripts.push(script) }
  await runPython(
    'val = input()\nprint(val)',
    { test_cases: [{ input: 'Halo', expected_output: 'Halo' }] }
  )
  const setupScript = executedStdinScripts[0]
  assert.equal(/\ninput = __ic_test_input/.test(setupScript), false)

  // Decrement `--` & URLs containing `//` must survive language-aware comment stripping
  const incDecCode = 'let poin=9; poin++; poin--; poin++; console.log(poin);'
  const incDecOut = await runJavascript(incDecCode, {})
  const incDecPassed = await runValidation(
    'stdout',
    [{ input: '', expected_output: '10', is_hidden: false }],
    incDecOut,
    incDecCode,
    { language: 'javascript', practice: { required_keywords: ['++', '--'] } }
  )
  assert.equal(incDecPassed, true)

  const urlKeywordCode = 'const q = new URL("http://x?a=1").searchParams; console.log(q.get("a"));'
  const urlKeywordOut = await runJavascript(urlKeywordCode, {})
  const urlKeywordPassed = await runValidation(
    'stdout',
    [{ input: '', expected_output: '1', is_hidden: false }],
    urlKeywordOut,
    urlKeywordCode,
    { language: 'javascript', practice: { required_keywords: ['searchParams'] } }
  )
  assert.equal(urlKeywordPassed, true)

  // DomValidator supports whitespace-separated rule blocks & source-order:last CSS cascade
  assert.equal(
    validateDom(
      '<style>.kartu{background-color:#f5f5f5;color:#222;font-size:16px}.kartu .nama{font-weight:700}</style><article class="kartu"><h2 class="nama">Rina</h2></article>',
      '.kartu{background-color:#f5f5f5;color:#222;font-size:16px} .kartu .nama{font-weight:700}'
    ),
    true
  )
  assert.equal(
    validateDom('<style>.pesan{color:red}.pesan{color:blue}</style><p class="pesan">P</p>', '.pesan{color:blue;source-order:last}'),
    true
  )
  assert.equal(
    validateDom('<style>.pesan{color:blue}.pesan{color:red}</style><p class="pesan">P</p>', '.pesan{color:blue;source-order:last}'),
    false
  )
})
