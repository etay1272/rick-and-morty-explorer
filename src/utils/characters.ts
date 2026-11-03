import type { Character, CharacterStatus } from '../types.ts'

export interface CharacterFilters {
  name: string
  status: CharacterStatus | 'All'
}

export function filterCharacters(
  characters: Character[],
  filters: CharacterFilters,
): Character[] {
  const normalizedName = filters.name.trim().toLowerCase()

  return characters.filter((character) => {
    const matchesName = character.name.toLowerCase().includes(normalizedName)
    const matchesStatus = filters.status === 'All' || character.status === filters.status
    return matchesName && matchesStatus
  })
}
