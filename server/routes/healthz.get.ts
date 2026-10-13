export default defineEventHandler((event) => {
  const { origin } = getRequestURL(event)
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return {
    base_url: origin,
    now: new Date().toISOString().replace('Z', '+00:00')
  }
})
