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
const load = (path, names, globals) => {
  let source = fs.readFileSync(new URL(path, import.meta.url), 'utf8')
  if (path.endsWith('.vue')) source = source.match(/<script setup>([\s\S]*?)<\/script>/)[1]
  source = source.replace(/^import .*\n/gm, '').replace(/export /g, '')
  const context = vm.createContext({ ref, computed, console, ssoEnabled: false, ...globals })
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

test('Energy retry after timeout and reload reuses UUID and blocks double submit', async () => {
  const localStorage = storage(), keys = []
  let fail = true, release
  const api = { post: async (url, body, options) => {
    assert.equal(url, '/shop/purchase/coinz'); assert.equal(body.package_id, '2')
    keys.push(options.headers['Idempotency-Key'])
    if (fail) { await new Promise(resolve => { release = resolve }); throw { response: { status: 503 } } }
    return { data: { success: true } }
  } }
  const globals = { api, localStorage, crypto: webcrypto, useRoute: () => ({ query: { pkgId: '2', method: 'coinz' } }), useUserAccount: () => ({ userProfile: ref({ id: 7 }), fetchUser: async () => {}, fetchWallet: async () => {} }) }
  let checkout = load('../src/views/ShopCheckoutView.vue', 'processPayment, state', globals)
  const pending = checkout.processPayment(); await checkout.processPayment(); assert.equal(keys.length, 1)
  release(); await pending
  fail = false
  checkout = load('../src/views/ShopCheckoutView.vue', 'processPayment, state', globals)
  await checkout.processPayment()
  assert.equal(keys[0], keys[1]); assert.equal(checkout.state.value, 'success')
  assert.equal(localStorage.getItem('ic_energy_purchase:7'), null)
})

test('Energy intent cannot be spent on a different package', async () => {
  const localStorage = storage()
  localStorage.setItem('ic_energy_purchase:7', JSON.stringify({ key: 'same', package_id: 1, status: 'pending' }))
  let called = false
  const checkout = load('../src/views/ShopCheckoutView.vue', 'processPayment, errorMsg', {
    api: { post: async () => { called = true } }, localStorage, crypto: webcrypto,
    useRoute: () => ({ query: { pkgId: '2', method: 'coinz' } }),
    useUserAccount: () => ({ userProfile: ref({ id: 7 }) })
  })
  await checkout.processPayment(); assert.equal(called, false); assert.match(checkout.errorMsg.value, /sebelumnya/)
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
  const checkout = load('../src/components/checkout/CheckoutStepSelection.vue', 'goToInstruction, invoiceUncertain', {
    api, localStorage, useUserAccount: () => ({ userProfile: ref({ id: 7 }) }), defineProps: () => props, defineEmits: () => (...args) => emitted.push(args)
  })
  await checkout.goToInstruction()
  assert.equal(calls.length, 1); assert.equal(calls[0].url, '/payments/create')
  assert.deepEqual(Object.keys(calls[0].body).sort(), ['coupon_code', 'item_type', 'payment_method', 'plan_slug'])
  assert.equal(emitted.some(([event]) => event === 'success'), false)
  assert.equal(emitted.find(([event]) => event === 'instruction')[1].paymentDetails.order_id, 'ORDER')
})

test('Invoice timeout cannot create another invoice after retry or reload', async () => {
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
