<template>
  <div v-if="modelValue" class="modal-backdrop" @click="close">
    <div class="modal-content" :class="{ 'modal-wide': Boolean(path) }" @click.stop>
      <div class="modal-icon">
        <i :class="canClaimPro ? 'fa-solid fa-layer-group' : 'fa-solid fa-crown'"></i>
      </div>

      <template v-if="canClaimPro">
        <h2>Aktifkan dengan Kuota Pro</h2>
        <p class="modal-subtitle">
          Buka alur belajar <strong>{{ path?.title }}</strong> menggunakan kuota paket Pro Anda.
        </p>

        <div class="pro-quota-box">
          <div class="quota-row">
            <span>Sisa Kuota Bulan Ini</span>
            <strong>{{ remainingQuota }} / {{ totalQuota }} Modul</strong>
          </div>
          <div class="quota-warning">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Pilihan modul tidak dapat dibatalkan atau diganti setelah diklaim.
          </div>
        </div>

        <div v-if="claimError" class="modal-error">{{ claimError }}</div>

        <div class="modal-actions">
          <button class="btn-cancel" :disabled="isClaiming" @click="close">Batal</button>
          <button class="btn-subscribe" :disabled="isClaiming" @click="claimProModule">
            {{ isClaiming ? 'Memproses Klaim...' : 'Klaim Modul Ini (Kuota Pro)' }}
          </button>
        </div>
      </template>

      <template v-else-if="path">
        <h2>{{ isProExhausted ? 'Kuota Pro Bulan Ini Habis' : 'Modul Terkunci' }}</h2>
        <p class="modal-subtitle">
          <template v-if="isProExhausted">
            Seluruh {{ totalQuota }} kuota modul Pro bulan ini sudah terpakai. Anda tetap dapat membeli
            <strong>{{ path.title }}</strong> satuan dengan iCoinZ atau upgrade ke <strong>Expert Plan</strong>.
          </template>
          <template v-else>
            Buka akses <strong>{{ path.title }}</strong> selama {{ path.duration_days || 30 }} hari dengan
            <strong>iCoinZ</strong> di GameZ Shop, atau berlangganan <strong>PRO / EXPERT</strong> untuk akses penuh.
          </template>
        </p>

        <div class="modal-actions stacked-actions">
          <button class="btn-buy-single" @click="goToModuleShop">
            <i class="fa-solid fa-coins"></i>
            Beli Modul Satuan ({{ formatPrice(path.price_icoinz || 14999) }} c)
          </button>
          <button class="btn-subscribe" @click="subscribe">
            <i class="fa-solid fa-crown"></i>
            {{ isProExhausted ? 'Upgrade ke Expert Plan' : 'Langganan PRO / EXPERT' }}
          </button>
          <button class="btn-cancel" @click="close">Nanti Saja</button>
        </div>
      </template>

      <template v-else>
        <h2>Konten Premium</h2>
        <p>Modul atau fitur ini eksklusif untuk member Premium. Silakan berlangganan terlebih dahulu untuk mengakses secara lengkap.</p>
        
        <div class="modal-actions">
          <button class="btn-cancel" @click="close">Batal</button>
          <button class="btn-subscribe" @click="subscribe">Berlangganan Sekarang</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { useUserAccount } from '../../composables/useUserAccount'
import { useLearningPaths } from '../../composables/useLearningPaths'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  path: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'unlocked'])
const router = useRouter()
const { isLoggedIn, currentPlan, proQuota, fetchUser, systemConfig } = useUserAccount()
const { fetchPaths } = useLearningPaths()
const { showToast } = useToast()

const isClaiming = ref(false)
const claimError = ref('')

const totalQuota = computed(() => Number(proQuota.value?.total_quota || systemConfig.value?.pro_max_selectable_modules || 12))
const remainingQuota = computed(() => Number(proQuota.value?.remaining_quota ?? 0))
const canClaimPro = computed(() => Boolean(props.path?.id) && currentPlan.value === 'pro' && remainingQuota.value > 0)
const isProExhausted = computed(() => Boolean(props.path?.id) && currentPlan.value === 'pro' && remainingQuota.value <= 0)

const formatPrice = (val) => Number(val || 0).toLocaleString('id-ID')

const close = () => {
  if (isClaiming.value) return
  claimError.value = ''
  emit('update:modelValue', false)
}

const subscribe = () => {
  if (isClaiming.value) return
  emit('update:modelValue', false)
  if (isLoggedIn.value) {
    router.push('/pricing')
  } else {
    router.push('/?auth=login')
  }
}

const goToModuleShop = () => {
  if (isClaiming.value) return
  emit('update:modelValue', false)
  if (!isLoggedIn.value) {
    router.push('/?auth=login')
    return
  }
  router.push(`/shop?tab=module&select=${props.path?.id || ''}`)
}

const claimProModule = async () => {
  if (isClaiming.value || !props.path?.id) return
  claimError.value = ''
  isClaiming.value = true

  try {
    const [res] = await Promise.all([
      api.post('/subscription/claim-pro-module', {
        learning_path_id: props.path.id
      }),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ])

    if (res.data?.success !== true) {
      throw new Error(res.data?.message || 'Gagal mengklaim kuota modul Pro')
    }

    try { localStorage.removeItem('ic_learning_paths_cache_v3') } catch {}
    await Promise.all([fetchUser(true), fetchPaths(true)])
    showToast(`Modul "${props.path.title}" berhasil diaktifkan!`, 'success')
    emit('unlocked', props.path.id)
    emit('update:modelValue', false)
  } catch (error) {
    claimError.value = error.response?.data?.message || error.message || 'Gagal mengklaim modul. Coba lagi.'
  } finally {
    isClaiming.value = false
  }
}
</script>

<style scoped src="../../assets/css/components/common/PremiumModal.css"></style>
