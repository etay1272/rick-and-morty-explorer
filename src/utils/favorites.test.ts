import { describe, expect, it } from 'vitest'
import type { Character } from '../types.ts'
import { FAVORITES_STORAGE_KEY, loadFavorites, parseFavorites, saveFavorites, toggleFavoriteCharacter } from './favorites.ts'

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
  episode: [],
  url: 'https://example.com/character/1',
  created: '2017-11-04T18:48:46.250Z',
}

describe('favorite character storage', () => {
  it('saves favorites and loads them again from storage', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }

    saveFavorites(storage, [rick])

    expect(values.has(FAVORITES_STORAGE_KEY)).toBe(true)
    expect(loadFavorites(storage)).toEqual([rick])
  })

  it('returns an empty list for malformed or non-list stored data', () => {
    expect(parseFavorites('{broken json')).toEqual([])
    expect(parseFavorites(JSON.stringify({ id: 1 }))).toEqual([])
  })

  it('adds a favorite once and removes it when toggled again', () => {
    const added = toggleFavoriteCharacter([], rick)
    expect(added).toEqual([rick])
    expect(toggleFavoriteCharacter(added, rick)).toEqual([])
  })
})
