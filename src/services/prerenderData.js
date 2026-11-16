// Data injected by build-time prerendering (scripts/prerender.mjs) for views that keep
// their content in local component state. Always empty in the browser.
export const prerenderData = {
  encyclopedia: null,
  topic: null,
}

export function setPrerenderData(values) {
  prerenderData.encyclopedia = values.encyclopedia ?? null
  prerenderData.topic = values.topic ?? null
}
