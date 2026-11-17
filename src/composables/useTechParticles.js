import { onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk tech particles (ikon teknologi melayang di background).
 * Menggunakan cached viewport dimensions, passive listeners, dan auto-pause saat tab tersembunyi.
 */
export function useTechParticles(containerRef) {
  const icons = [
    'fa-react', 'fa-vuejs', 'fa-laravel', 'fa-node-js', 'fa-python',
    'fa-java', 'fa-js', 'fa-html5', 'fa-css3-alt', 'fa-github',
    'fa-aws', 'fa-docker', 'fa-php'
  ]
  const particles = []
  let mouseX = -1000
  let mouseY = -1000
  let animationId = null
  let winW = typeof window !== 'undefined' ? window.innerWidth : 1280
  let winH = typeof window !== 'undefined' ? window.innerHeight : 800

  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  const handleResize = () => {
    winW = window.innerWidth || 1280
    winH = window.innerHeight || 800
  }

  const animate = () => {
    if (document.hidden) {
      animationId = null
      return
    }

    const maxDist = 200
    const maxDistSq = maxDist * maxDist

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.x += p.speedX
      p.y += p.speedY

      if (p.x < -100) p.x = winW + 100
      else if (p.x > winW + 100) p.x = -100
      if (p.y < -100) p.y = winH + 100
      else if (p.y > winH + 100) p.y = -100

      const dx = p.x - mouseX
      const dy = p.y - mouseY
      const distSq = dx * dx + dy * dy

      let repelX = 0
      let repelY = 0
      if (distSq < maxDistSq && distSq > 0) {
        const dist = Math.sqrt(distSq)
        const force = (maxDist - dist) / maxDist
        repelX = (dx / dist) * force * 40
        repelY = (dy / dist) * force * 40
      }

      p.el.style.transform = `translate3d(${(p.x + repelX).toFixed(1)}px, ${(p.y + repelY).toFixed(1)}px, 0)`
    }

    animationId = requestAnimationFrame(animate)
  }

  const handleVisibilityChange = () => {
    if (!document.hidden && animationId === null && particles.length > 0) {
      animationId = requestAnimationFrame(animate)
    }
  }

  onMounted(() => {
    if (!containerRef.value || typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    handleResize()
    const particleCount = winW < 768 ? 10 : 16
    const frag = document.createDocumentFragment()

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement('i')
      el.className = `fa-brands ${icons[Math.floor(Math.random() * icons.length)]} tech-icon`

      const x = Math.random() * winW
      const y = Math.random() * winH
      const speedX = (Math.random() - 0.5) * 0.75
      const speedY = (Math.random() - 0.5) * 0.75
      const size = Math.random() * 1.8 + 1.4
      const opacity = Math.random() * 0.35 + 0.18

      el.style.fontSize = `${size}rem`
      el.style.opacity = opacity

      frag.appendChild(el)
      particles.push({ el, x, y, speedX, speedY })
    }

    containerRef.value.appendChild(frag)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationId = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    if (animationId !== null) cancelAnimationFrame(animationId)
    animationId = null
  })
}
