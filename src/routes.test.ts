import { describe, expect, it } from 'vitest'
import { parseCharacterId } from './routes.ts'

describe('parseCharacterId', () => {
  it('parses a positive numeric route parameter', () => {
    expect(parseCharacterId('25')).toBe(25)
  })

  it('rejects a missing route parameter', () => {
    expect(parseCharacterId(undefined)).toBeNull()
  })

  it('rejects non-numeric route parameters', () => {
    expect(parseCharacterId('rick')).toBeNull()
  })

  it('rejects zero because character IDs are positive', () => {
    expect(parseCharacterId('0')).toBeNull()
  })

  it('rejects numbers outside the safe integer range', () => {
    expect(parseCharacterId('999999999999999999999')).toBeNull()
  })
})
