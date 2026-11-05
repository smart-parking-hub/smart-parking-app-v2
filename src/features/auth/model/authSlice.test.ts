import { describe, expect, it } from 'vitest'
import reducer, { authenticated, signedOut } from './authSlice'
describe('auth session state', () => {
  it.each(['DRIVER', 'MERCHANT', 'ADMIN'] as const)('stores verified %s role and clears on logout', (role) => {
    const state = reducer(undefined, authenticated({ role }))
    expect(state.role).toBe(role)
    expect(reducer(state, signedOut()).role).toBeNull()
  })
})
