import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useRoute } from '#app'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

const RouteProbe = defineComponent({
  setup() {
    const route = useRoute()

    return () => h('p', `Current route: ${route.path}`)
  }
})

describe('Nuxt browser environment', () => {
  it('provides the current route to mounted components', async () => {
    await mountSuspended(RouteProbe, {
      route: '/browser-test',
      attachTo: document.body
    })

    await expect.element(page.getByText('Current route: /browser-test')).toBeVisible()
  })
})
