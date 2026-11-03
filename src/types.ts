export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown'

export interface ApiResourceReference {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: CharacterGender
  origin: ApiResourceReference
  location: ApiResourceReference
  image: string
  episode: string[]
  url: string
  created: string
}

export interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface ApiPageInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface ApiPage<T> {
  info: ApiPageInfo
  results: T[]
}

export interface CharacterQuery {
  name?: string
  status?: CharacterStatus
  page?: number
}

export interface EpisodeQuery {
  name?: string
  page?: number
}
