import { createContext, useContext } from 'react'
import type { Character } from './types.ts'

export interface FavoritesContextValue {
  favorites: Character[]
  isFavorite(id: number): boolean
  toggleFavorite(character: Character): void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider.')
  return context
}
