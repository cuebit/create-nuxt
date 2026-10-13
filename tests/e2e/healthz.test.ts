import { fetch, setup } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url))
})

describe('GET /healthz', () => {
  it('reports that the application is alive', async () => {
    const requestedAt = Date.now()
    const response = await fetch('/healthz')
    const respondedAt = Date.now()
    const body = await response.json() as { base_url: string, now: string }

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(body).toEqual({
      base_url: new URL(response.url).origin,
      now: expect.any(String)
    })
    expect(body.now).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+00:00$/)
    expect(Date.parse(body.now)).toBeGreaterThanOrEqual(requestedAt)
    expect(Date.parse(body.now)).toBeLessThanOrEqual(respondedAt)
  })
})
