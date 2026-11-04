import { describe, expect, it } from 'vitest'
import { matchRoutes, type RouteObject } from 'react-router-dom'
import { router } from './index'

describe('Merged route ownership', () => {
  it.each(['', '/edit', '/slots'])(
    'passes the lot ID to the incoming Merchant screen (%s)',
    (suffix) => {
      const match = matchRoutes(
        router.routes,
        `/merchant/parking-lots/42${suffix}`,
      )?.at(-1)
      expect(match?.params.parkingLotId).toBe('42')
    },
  )
  it('keeps the existing pricing route with its expected parameter', () => {
    expect(
      matchRoutes(router.routes, '/merchant/parking-lots/42/pricing')?.at(-1)
        ?.params.id,
    ).toBe('42')
  })
  it('does not shadow routes with duplicate path shapes', () => {
    const visit = (routes: RouteObject[]) => {
      const shapes = routes
        .map((route) =>
          route.index
            ? '__index'
            : route.path?.replace(/:[^/]+/g, ':parameter'),
        )
        .filter((shape) => shape !== undefined)
      expect(new Set(shapes).size).toBe(shapes.length)
      for (const route of routes) if (route.children) visit(route.children)
    }
    visit(router.routes)
  })
})
