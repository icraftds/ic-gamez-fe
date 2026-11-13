<template>
  <Teleport to="body">
    <div v-if="modelValue" class="insufficient-backdrop" @click="close">
      <div class="insufficient-card" @click.stop role="dialog" aria-modal="true" aria-labelledby="insufficient-title">
        <div class="insufficient-icon">
          <i class="fa-solid fa-coins"></i>
        </div>

        <h2 id="insufficient-title">iCoinZ Tidak Mencukupi</h2>
        <p class="insufficient-desc">
          Saldo iCoinZ kamu belum cukup untuk membeli
          <strong>{{ itemName || 'item pilihanmu' }}</strong>.
          Top up iCoinZ melalui <strong>iC Market</strong> terlebih dahulu.
        </p>

        <div class="balance-breakdown">
          <div class="breakdown-row">
            <span>Total Dibutuhkan</span>
            <span class="val required">{{ formatNumber(requiredAmount) }} c</span>
          </div>
          <div class="breakdown-row">
            <span>Saldo Saat Ini</span>
            <span class="val current">{{ formatNumber(currentBalance) }} c</span>
          </div>
          <div class="breakdown-row divider-row">
            <span>Kekurangan Saldo</span>
            <span class="val deficit">-{{ formatNumber(deficitAmount) }} c</span>
          </div>
        </div>

        <div class="insufficient-actions">
          <button type="button" class="btn-modal-cancel" @click="close">
            Tutup
          </button>
          <a
            v-if="marketRedirectEnabled && resolvedMarketUrl"
            :href="resolvedMarketUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-modal-market"
            @click="close"
          >
            <i class="fa-solid fa-up-right-from-square"></i>
            Top Up di iC Market
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  itemName: { type: String, default: '' },
  requiredAmount: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  marketUrl: { type: String, default: 'https://market.icraftds.id/topup' },
  marketRedirectEnabled: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

const deficitAmount = computed(() => {
  const diff = Number(props.requiredAmount || 0) - Number(props.currentBalance || 0)
  return diff > 0 ? diff : 0
})

const resolvedMarketUrl = computed(() => {
  const base = (props.marketUrl || 'https://market.icraftds.id/topup').trim()
  return base || 'https://market.icraftds.id/topup'
})

const formatNumber = (num) => Number(num || 0).toLocaleString('id-ID')

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.insufficient-backdrop {
  position: fixed;
  inset: 0;
  background: var(--black-alpha-0_7, rgba(2, 6, 23, 0.78));
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1200;
}

.insufficient-card {
  background: var(--glass-bg-card-0_95, rgba(15, 23, 42, 0.96));
  border: 1px solid rgba(245, 158, 11, 0.45);
  border-radius: 18px;
  padding: 32px 28px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45), 0 0 28px rgba(245, 158, 11, 0.16);
  animation: modalSlideUp 0.24s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.insufficient-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #fbbf24);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.85rem;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}

h2 {
  margin: 0 0 10px;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main-hex, #f8fafc);
}

.insufficient-desc {
  margin: 0 0 20px;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-sub-hex, #94a3b8);
}

.insufficient-desc strong {
  color: var(--text-main-hex, #f8fafc);
}

.balance-breakdown {
  background: var(--white-alpha-0_05, rgba(255, 255, 255, 0.04));
  border: 1px solid var(--white-alpha-0_1, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 24px;
  text-align: left;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.92rem;
  color: var(--text-sub-hex, #94a3b8);
  padding: 5px 0;
}

.breakdown-row.divider-row {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--white-alpha-0_15, rgba(255, 255, 255, 0.14));
  font-weight: 700;
}

.val.required {
  color: var(--text-main-hex, #f8fafc);
  font-weight: 700;
}

.val.current {
  color: #f59e0b;
  font-weight: 700;
}

.val.deficit {
  color: #f43f5e;
  font-weight: 800;
}

.insufficient-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-modal-cancel,
.btn-modal-market {
  padding: 11px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-modal-cancel {
  background: var(--white-alpha-0_1, rgba(255, 255, 255, 0.08));
  color: var(--text-main-hex, #f8fafc);
  border: 1px solid var(--white-alpha-0_2, rgba(255, 255, 255, 0.18));
}

.btn-modal-cancel:hover {
  background: var(--white-alpha-0_2, rgba(255, 255, 255, 0.15));
}

.btn-modal-market {
  flex: 1;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
}

.btn-modal-market:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
}

@media (max-width: 480px) {
  .insufficient-backdrop {
    padding: 14px;
  }

  .insufficient-card {
    padding: 24px 18px;
    border-radius: 16px;
  }

  .insufficient-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
    margin-bottom: 14px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .insufficient-desc {
    font-size: 0.88rem;
    margin-bottom: 16px;
  }

  .balance-breakdown {
    padding: 12px 14px;
    margin-bottom: 18px;
  }

  .breakdown-row {
    font-size: 0.85rem;
  }

  .insufficient-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .btn-modal-cancel,
  .btn-modal-market {
    width: 100%;
    padding: 10px 14px;
    font-size: 0.88rem;
  }
}
</style>
