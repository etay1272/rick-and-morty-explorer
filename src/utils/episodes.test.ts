import { describe, expect, it } from 'vitest'
import { formatEpisodeCode } from './episodes.ts'

describe('formatEpisodeCode', () => {
  it('keeps a correctly formatted episode code', () => {
    expect(formatEpisodeCode('S01E02')).toBe('S01E02')
  })

  it('normalizes lowercase codes and pads single-digit numbers', () => {
    expect(formatEpisodeCode('s1e2')).toBe('S01E02')
  })

  it('trims surrounding whitespace', () => {
    expect(formatEpisodeCode('  S3E9  ')).toBe('S03E09')
  })

  it('preserves a code that does not match the expected format', () => {
    expect(formatEpisodeCode('Special episode')).toBe('Special episode')
  })
})
