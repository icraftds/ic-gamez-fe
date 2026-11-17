import { onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk efek parallax pada elemen berdasarkan posisi kursor.
 * Di-throttle dengan requestAnimationFrame agar tidak memicu layout/composite berlebih.
 */
export function useOrbParallax(orbRefs) {
  let rafId = null
  let latestX = 0
  let latestY = 0
  let winW = typeof window !== 'undefined' ? window.innerWidth : 1280
  let winH = typeof window !== 'undefined' ? window.innerHeight : 800

  const applyTransform = () => {
    rafId = null
    const mX = latestX / winW - 0.5
    const mY = latestY / winH - 0.5

    orbRefs.forEach((orbRef, index) => {
      if (orbRef.value) {
        const speed = (index + 1) * 30
        orbRef.value.style.transform = `translate3d(${mX * speed}px, ${mY * speed}px, 0)`
      }
    })
  }

  const handleMouseMove = (e) => {
    latestX = e.clientX
    latestY = e.clientY
    if (rafId === null && typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(applyTransform)
    }
  }

  const handleResize = () => {
    winW = window.innerWidth || 1280
    winH = window.innerHeight || 800
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    handleResize()
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId)
    }
  })
}
