import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk tech particles (ikon teknologi melayang di background).
 * Mereplikasi efek dari prototipe HTML asli: partikel bergerak perlahan
 * dan terdorong menjauhi kursor (repel effect).
 */
export function useTechParticles(containerRef) {
  const icons = [
    'fa-react', 'fa-vuejs', 'fa-laravel', 'fa-node-js', 'fa-python',
    'fa-java', 'fa-js', 'fa-html5', 'fa-css3-alt', 'fa-github',
    'fa-aws', 'fa-docker', 'fa-php'
  ]
  const NUM_PARTICLES = 25
  const particles = []
  let mouseX = -1000
  let mouseY = -1000
  let animationId = null

  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  const animate = () => {
    particles.forEach((p) => {
      p.x += p.speedX
      p.y += p.speedY

      // Wrap around edges
      if (p.x < -100) p.x = window.innerWidth + 100
      if (p.x > window.innerWidth + 100) p.x = -100
      if (p.y < -100) p.y = window.innerHeight + 100
      if (p.y > window.innerHeight + 100) p.y = -100

      // Repel effect based on mouse distance
      const dx = p.x - mouseX
      const dy = p.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 200

      let repelX = 0
      let repelY = 0

      if (dist < maxDist && dist > 0) {
        const force = (maxDist - dist) / maxDist
        repelX = (dx / dist) * force * 40
        repelY = (dy / dist) * force * 40
      }

      p.el.style.transform = `translate3d(${p.x + repelX}px, ${p.y + repelY}px, 0)`
    })
    animationId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    if (!containerRef.value) return

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const el = document.createElement('i')
      el.className = `fa-brands ${icons[Math.floor(Math.random() * icons.length)]} tech-icon`

      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      const speedX = (Math.random() - 0.5) * 0.8
      const speedY = (Math.random() - 0.5) * 0.8
      const size = Math.random() * 2 + 1.5
      const opacity = Math.random() * 0.4 + 0.2

      el.style.fontSize = `${size}rem`
      el.style.opacity = opacity

      containerRef.value.appendChild(el)
      particles.push({ el, x, y, speedX, speedY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    if (animationId) cancelAnimationFrame(animationId)
  })
}
