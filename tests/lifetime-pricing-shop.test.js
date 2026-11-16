import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolvePlanPresentation } from '../src/utils/planPresentation.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

test('resolvePlanPresentation resolves Lifetime plan with Selamanya duration and preserves Pro/Expert durations', () => {
  const lifetime = resolvePlanPresentation({
    id: 4,
    slug: 'lifetime',
    name: 'Lifetime Plan',
    price: 499000,
    duration_in_days: 0,
    is_lifetime: true,
    icoinz_reward: 500000,
  }, 6)

  assert.equal(lifetime.isLifetime, true)
  assert.equal(lifetime.durationLabel, 'Selamanya (Lifetime)')
  assert.equal(lifetime.badgeLabel, 'Best Value · Selamanya')
  assert.ok(lifetime.orderedBenefits.some((b) => b.text.includes('500.000')))

  const pro = resolvePlanPresentation({
    id: 1,
    slug: 'pro',
    name: 'Pro Plan',
    price: 49999,
    duration_in_days: 30,
    is_lifetime: false,
  }, 3)

  assert.equal(pro.isLifetime, false)
  assert.equal(pro.durationLabel, '90 Hari')
})

test('PricingView contains hero section, lifetime offer showcase, and carousel controls', () => {
  const pricingVue = fs.readFileSync(path.join(rootDir, 'src/views/PricingView.vue'), 'utf8')
  const shopVue = fs.readFileSync(path.join(rootDir, 'src/views/ShopView.vue'), 'utf8')
  const shopCheckoutVue = fs.readFileSync(path.join(rootDir, 'src/views/ShopCheckoutView.vue'), 'utf8')

  assert.match(pricingVue, /pricing-hero/)
  assert.match(pricingVue, /lifetime-offer-card/)
  assert.match(pricingVue, /plans-carousel-track/)
  assert.match(pricingVue, /carousel-arrow-btn/)
  assert.match(shopVue, /Akses Lifetime \(Selamanya\)/)
  assert.match(shopCheckoutVue, /isLifetimeModule/)
})
