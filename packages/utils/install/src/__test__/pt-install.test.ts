import { describe, it, expect } from 'vitest'
import { withInstall } from '../index'

describe('pt-install', () => {
  it('should be defined', () => {
    expect(withInstall).toBeDefined()
  })
})
