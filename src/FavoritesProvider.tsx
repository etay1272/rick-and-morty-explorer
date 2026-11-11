import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Character } from './types.ts'
import { FavoritesContext } from './FavoritesContext.ts'
import { loadFavorites, saveFavorites, toggleFavoriteCharacter } from './utils/favorites.ts'

interface FavoritesProviderProps {
  children: ReactNode
}

function getInitialFavorites(): Character[] {
  try {
    return loadFavorites(window.localStorage)
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState(getInitialFavorites)

  useEffect(() => {
    try {
      saveFavorites(window.localStorage, favorites)
    } catch {
      // Keep the in-memory favorite state usable if browser storage is unavailable.
    }
  }, [favorites])

  const value = {
    favorites,
    isFavorite: (id: number) => favorites.some((favorite) => favorite.id === id),
    toggleFavorite: (character: Character) => {
      setFavorites((current) => toggleFavoriteCharacter(current, character))
    },
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
