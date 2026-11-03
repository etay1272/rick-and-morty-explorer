import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError, getCharacterById, getCharacterPage, getEpisodePage } from './rickAndMortyApi.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Rick and Morty API client', () => {
  it('requests characters with the supplied filters', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] })),
    )
    vi.stubGlobal('fetch', fetchMock)

    await getCharacterPage({ name: ' Rick ', status: 'Alive', page: 2 })

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]))
    expect(requestUrl.pathname).toBe('/api/character')
    expect(requestUrl.searchParams.get('name')).toBe('Rick')
    expect(requestUrl.searchParams.get('status')).toBe('Alive')
    expect(requestUrl.searchParams.get('page')).toBe('2')
  })

  it('requests a single character by ID', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: 42 }), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await getCharacterById(42)

    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      'https://rickandmortyapi.com/api/character/42',
    )
  })

  it('reports unsuccessful HTTP responses with their status code', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response('Server error', { status: 503 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const request = getEpisodePage()
    await expect(request).rejects.toBeInstanceOf(ApiRequestError)
    await expect(request).rejects.toMatchObject({ statusCode: 503 })
  })

  it('rejects invalid page numbers before making a request', () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    expect(() => getEpisodePage({ page: 0 })).toThrow(RangeError)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
