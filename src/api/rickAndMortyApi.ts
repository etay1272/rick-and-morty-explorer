import type { ApiPage, Character, CharacterQuery, Episode, EpisodeQuery } from '../types.ts'

const API_BASE_URL = 'https://rickandmortyapi.com/api'

export class ApiRequestError extends Error {
  readonly statusCode: number

  constructor(statusCode: number) {
    super(`Rick and Morty API request failed with status ${statusCode}.`)
    this.name = 'ApiRequestError'
    this.statusCode = statusCode
  }
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new ApiRequestError(response.status)
  }

  const payload: unknown = await response.json()
  return payload as T
}

interface CollectionQuery {
  name?: string
  page?: number
  status?: string
}

function createCollectionUrl(resource: 'character' | 'episode', query: CollectionQuery): URL {
  const url = new URL(`${API_BASE_URL}/${resource}`)
  const name = query.name?.trim()

  if (name) {
    url.searchParams.set('name', name)
  }

  if (query.status) {
    url.searchParams.set('status', query.status)
  }

  if (query.page !== undefined) {
    if (!Number.isSafeInteger(query.page) || query.page < 1) {
      throw new RangeError('Page must be a positive safe integer.')
    }
    url.searchParams.set('page', String(query.page))
  }

  return url
}

export function getCharacterPage(query: CharacterQuery = {}): Promise<ApiPage<Character>> {
  return fetchJson<ApiPage<Character>>(createCollectionUrl('character', query))
}

export function getCharacterById(id: number): Promise<Character> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new RangeError('Character ID must be a positive safe integer.')
  }

  return fetchJson<Character>(new URL(`${API_BASE_URL}/character/${id}`))
}

export async function getEpisodesByIds(ids: number[]): Promise<Episode[]> {
  if (ids.length === 0) return []

  if (ids.some((id) => !Number.isSafeInteger(id) || id < 1)) {
    throw new RangeError('Episode IDs must be positive safe integers.')
  }

  const resourceId = ids.join(',')
  const result = await fetchJson<Episode | Episode[]>(
    new URL(`${API_BASE_URL}/episode/${resourceId}`),
  )

  return Array.isArray(result) ? result : [result]
}

export function getEpisodePage(query: EpisodeQuery = {}): Promise<ApiPage<Episode>> {
  return fetchJson<ApiPage<Episode>>(createCollectionUrl('episode', query))
}
