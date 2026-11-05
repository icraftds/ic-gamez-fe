export function createPaymentPoll(check, {
  onTimeout = () => {},
  isAuthenticated = () => true,
  timeoutMs = 120000,
  delays = [3000, 5000, 10000, 15000]
} = {}) {
  let timer = null
  let generation = 0
  let deadline = 0
  let attempt = 0
  let wanted = false
  const suspend = () => {
    generation++
    clearTimeout(timer)
    timer = null
  }
  const stop = () => { wanted = false; suspend() }
  const start = () => {
    suspend()
    wanted = true
    const run = generation
    deadline = Date.now() + timeoutMs
    attempt = 0
    const tick = async () => {
      if (run !== generation || document.hidden) return
      if (!isAuthenticated()) { stop(); return }
      if (Date.now() >= deadline) { onTimeout(); stop(); return }
      let done = false
      try { done = await check(() => run === generation && !document.hidden && isAuthenticated()) } catch (error) {
        const status = error.response?.status || error.statusCode || error.status
        if (status === 401 || status === 403) { stop(); return }
      }
      if (run !== generation) return
      if (done) { stop(); return }
      if (Date.now() >= deadline) { onTimeout(); stop(); return }
      const delay = delays[Math.min(attempt++, delays.length - 1)]
      timer = setTimeout(tick, Math.min(delay, Math.max(0, deadline - Date.now())))
    }
    tick()
  }
  const visibility = () => {
    if (document.hidden) suspend()
    else if (wanted && isAuthenticated()) start()
  }
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', visibility)
  const dispose = () => { stop(); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visibility) }
  return { start, stop, dispose }
}
