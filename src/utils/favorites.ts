import type { Character, CharacterGender, CharacterStatus } from '../types.ts'

export const FAVORITES_STORAGE_KEY = 'rick-and-morty-explorer:favorites'

export interface FavoritesStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isResourceReference(value: unknown): boolean {
  return isRecord(value) && typeof value.name === 'string' && typeof value.url === 'string'
}

function isCharacter(value: unknown): value is Character {
  if (!isRecord(value)) return false

  const statuses: CharacterStatus[] = ['Alive', 'Dead', 'unknown']
  const genders: CharacterGender[] = ['Female', 'Male', 'Genderless', 'unknown']

  return Number.isSafeInteger(value.id)
    && Number(value.id) > 0
    && typeof value.name === 'string'
    && statuses.includes(value.status as CharacterStatus)
    && typeof value.species === 'string'
    && typeof value.type === 'string'
    && genders.includes(value.gender as CharacterGender)
    && isResourceReference(value.origin)
    && isResourceReference(value.location)
    && typeof value.image === 'string'
    && Array.isArray(value.episode)
    && value.episode.every((episodeUrl: unknown) => typeof episodeUrl === 'string')
    && typeof value.url === 'string'
    && typeof value.created === 'string'
}

export function parseFavorites(serialized: string | null): Character[] {
  if (!serialized) return []

  try {
    const parsed: unknown = JSON.parse(serialized)
    return Array.isArray(parsed) ? parsed.filter(isCharacter) : []
  } catch {
    return []
  }
}

export function loadFavorites(storage: FavoritesStorage): Character[] {
  return parseFavorites(storage.getItem(FAVORITES_STORAGE_KEY))
}

export function saveFavorites(storage: FavoritesStorage, favorites: Character[]): void {
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
}

export function toggleFavoriteCharacter(
  favorites: Character[],
  character: Character,
): Character[] {
  if (favorites.some((favorite) => favorite.id === character.id)) {
    return favorites.filter((favorite) => favorite.id !== character.id)
  }

  return [...favorites, character]
}
