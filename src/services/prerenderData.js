// Data injected by build-time prerendering (scripts/prerender.mjs) for views that keep
// their content in local component state. In the browser, hydrate once from #__PRERENDER_DATA__.
function readBrowserPrerenderPayload() {
  if (typeof document === 'undefined') return null
  try {
    const el = document.getElementById('__PRERENDER_DATA__')
    if (!el || !el.textContent) return null
    return JSON.parse(el.textContent)
  } catch {
    return null
  }
}

const browserSeed = readBrowserPrerenderPayload()

export const prerenderData = {
  paths: browserSeed?.paths ?? null,
  plans: browserSeed?.plans ?? null,
  encyclopedia: browserSeed?.encyclopedia ?? null,
  topic: browserSeed?.topic ?? null,
}

export function setPrerenderData(values) {
  prerenderData.paths = values.paths ?? null
  prerenderData.plans = values.plans ?? null
  prerenderData.encyclopedia = values.encyclopedia ?? null
  prerenderData.topic = values.topic ?? null
}
