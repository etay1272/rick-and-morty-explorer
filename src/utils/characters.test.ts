import { describe, expect, it } from 'vitest'
import { filterCharacters } from './characters.ts'
import type { Character } from '../types.ts'

const characters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: '',
    episode: [],
    url: '',
    created: '',
  },
  {
    id: 2,
    name: 'Birdperson',
    status: 'Dead',
    species: 'Bird-Person',
    type: '',
    gender: 'Male',
    origin: { name: 'Bird World', url: '' },
    location: { name: 'Bird World', url: '' },
    image: '',
    episode: [],
    url: '',
    created: '',
  },
  {
    id: 3,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: '',
    episode: [],
    url: '',
    created: '',
  },
]

describe('filterCharacters', () => {
  it('matches a case-insensitive name fragment', () => {
    expect(filterCharacters(characters, { name: 'RICK', status: 'All' }).map(({ id }) => id))
      .toEqual([1])
  })

  it('trims spaces from the search text', () => {
    expect(filterCharacters(characters, { name: '  morty  ', status: 'All' }).map(({ id }) => id))
      .toEqual([3])
  })

  it('filters by status', () => {
    expect(filterCharacters(characters, { name: '', status: 'Dead' }).map(({ id }) => id))
      .toEqual([2])
  })

  it('applies name and status filters together', () => {
    expect(filterCharacters(characters, { name: 'r', status: 'Alive' }).map(({ id }) => id))
      .toEqual([1, 3])
  })
})
