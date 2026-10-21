<template>
  <div
    class="tl"
    :class="[`tl--${variant}`, `tl--${size}`]"
    role="status"
    aria-live="polite"
    :aria-label="message"
  >
    <!-- Inline: hanya prompt ">_" untuk di dalam tombol / input -->
    <span v-if="variant === 'inline'" class="tl-inline" aria-hidden="true">
      <span class="tl-prompt">&gt;</span><span class="tl-cursor">_</span>
      <span v-if="text || label" class="tl-inline-text">{{ message }}</span>
    </span>

    <div v-else class="tl-shell">
      <div class="tl-line" :key="message" :style="{ '--chars': message.length }" aria-hidden="true">
        <span class="tl-prompt">&gt;</span>
        <span class="tl-text">{{ message }}</span>
        <span class="tl-dots"><i>.</i><i>.</i><i>.</i></span>
        <span class="tl-cursor">_</span>
      </div>
      <div class="tl-bar" aria-hidden="true"><span></span></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** Objek yang sedang dimuat, mis. "sesi" -> "Memuat sesi" */
  label: { type: String, default: '' },
  /** Override seluruh teks, mis. "Memproses pembayaran" */
  text: { type: String, default: '' },
  /** block = di tengah section, overlay = layar penuh, inline = di dalam tombol */
  variant: {
    type: String,
    default: 'block',
    validator: v => ['block', 'overlay', 'inline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  }
})

const message = computed(() => props.text || (props.label ? `Memuat ${props.label}` : 'Memuat'))
</script>

<style scoped>
.tl {
  --tl-accent: var(--primary, #00f0ff);
  --tl-accent-2: #a78bfa;
  --tl-fg: var(--text-main-hex, #f8fafc);
  --tl-muted: var(--text-sub-hex, #94a3b8);
  --tl-font-size: 0.95rem;
  --tl-type-speed: 42ms;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--tl-fg);
  line-height: 1;
}

.tl--sm { --tl-font-size: 0.8rem; }
.tl--lg { --tl-font-size: 1.15rem; }

/* ───────── Block & overlay ───────── */
.tl--block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 48px 16px;
  box-sizing: border-box;
}
.tl--block.tl--sm { padding: 20px 12px; }

.tl--overlay {
  position: fixed;
  inset: 0;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(600px circle at 50% 45%, color-mix(in srgb, var(--tl-accent) 9%, transparent), transparent 70%),
    var(--bg-main, #0b1120);
  animation: tl-fade-in 0.35s ease both;
}

.tl-shell {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 20px 12px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tl-accent) 22%, transparent);
  background: color-mix(in srgb, var(--tl-accent) 5%, transparent);
  backdrop-filter: blur(8px);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--tl-fg) 3%, transparent) inset,
    0 10px 30px -12px color-mix(in srgb, var(--tl-accent) 35%, transparent);
  animation: tl-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.tl--sm .tl-shell { padding: 10px 14px 9px; gap: 9px; border-radius: 10px; }
.tl--lg .tl-shell { padding: 18px 26px 14px; gap: 14px; border-radius: 14px; }
.tl--overlay .tl-shell { padding: 20px 30px 16px; }

.tl-line {
  display: flex;
  align-items: baseline;
  gap: 0.6ch;
  font-size: var(--tl-font-size);
  white-space: nowrap;
}

/* Prompt ">" dengan gradient + glow lembut */
.tl-prompt {
  font-weight: 700;
  background: linear-gradient(135deg, var(--tl-accent), var(--tl-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tl-accent) 55%, transparent));
  animation: tl-glow 2.4s ease-in-out infinite;
}

/* Efek mengetik per karakter */
.tl-text {
  display: inline-block;
  overflow: hidden;
  width: 0;
  font-weight: 500;
  letter-spacing: 0.01em;
  animation: tl-type calc(var(--chars) * var(--tl-type-speed)) steps(var(--chars), end) 0.15s forwards;
}

/* Titik-titik muncul bergantian setelah teks selesai diketik */
.tl-dots {
  display: inline-flex;
  margin-left: -0.6ch;
  color: var(--tl-muted);
}
.tl-dots i {
  font-style: normal;
  opacity: 0;
  animation: tl-dot 1.4s ease-in-out infinite;
  animation-delay: calc(var(--d, 0s) + 0.15s + (var(--chars, 10) * var(--tl-type-speed)));
}
.tl-dots i:nth-child(1) { --d: 0s; }
.tl-dots i:nth-child(2) { --d: 0.2s; }
.tl-dots i:nth-child(3) { --d: 0.4s; }

/* Kursor "_" berkedip halus */
.tl-cursor {
  color: var(--tl-accent);
  font-weight: 700;
  margin-left: 0.1ch;
  text-shadow: 0 0 8px color-mix(in srgb, var(--tl-accent) 70%, transparent);
  animation: tl-blink 1.05s ease-in-out infinite;
}

/* Scan bar tipis (indeterminate) */
.tl-bar {
  position: relative;
  height: 2px;
  border-radius: 2px;
  overflow: hidden;
  background: color-mix(in srgb, var(--tl-fg) 8%, transparent);
}
.tl-bar span {
  position: absolute;
  inset: 0 auto 0 0;
  width: 35%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, var(--tl-accent), var(--tl-accent-2), transparent);
  box-shadow: 0 0 10px var(--tl-accent);
  animation: tl-scan 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

/* ───────── Inline (di dalam tombol) ───────── */
.tl--inline {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  color: inherit;
}
.tl-inline {
  display: inline-flex;
  align-items: baseline;
  gap: 0.05ch;
  font-size: 0.9em;
  font-weight: 700;
}
.tl--inline .tl-prompt {
  filter: none;
  background: none;
  color: currentColor;
  opacity: 0.85;
  animation: none;
}
.tl--inline .tl-cursor {
  color: currentColor;
  text-shadow: none;
}
.tl-inline-text {
  margin-left: 0.6ch;
  font-weight: 500;
}

/* ───────── Keyframes ───────── */
@keyframes tl-type {
  to { width: calc(var(--chars) * 1ch + 0.02em * var(--chars)); }
}
@keyframes tl-blink {
  0%, 45% { opacity: 1; }
  55%, 100% { opacity: 0.1; }
}
@keyframes tl-dot {
  0%, 100% { opacity: 0; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-1px); }
}
@keyframes tl-glow {
  0%, 100% { filter: drop-shadow(0 0 4px color-mix(in srgb, var(--tl-accent) 40%, transparent)); }
  50% { filter: drop-shadow(0 0 9px color-mix(in srgb, var(--tl-accent) 75%, transparent)); }
}
@keyframes tl-scan {
  0% { transform: translateX(-110%); }
  100% { transform: translateX(310%); }
}
@keyframes tl-rise {
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
@keyframes tl-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .tl-text { width: auto; animation: none; }
  .tl-dots i { opacity: 1; animation: none; }
  .tl-cursor, .tl-prompt, .tl-shell, .tl--overlay { animation: none; }
  .tl-bar span { animation: none; width: 100%; opacity: 0.5; }
}
</style>
