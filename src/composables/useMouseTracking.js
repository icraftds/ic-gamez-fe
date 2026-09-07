import { onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk efek parallax pada elemen berdasarkan posisi kursor.
 * Menggunakan logika yang sama dengan prototipe HTML asli:
 * setiap orb bergerak dengan kecepatan berbeda berdasarkan index-nya.
 */
export function useOrbParallax(orbRefs) {
  const handleMouseMove = (e) => {
    const mX = e.clientX / window.innerWidth - 0.5
    const mY = e.clientY / window.innerHeight - 0.5

    orbRefs.forEach((orbRef, index) => {
      if (orbRef.value) {
        const speed = (index + 1) * 30
        orbRef.value.style.transform = `translate(${mX * speed}px, ${mY * speed}px)`
      }
    })
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })
}
