import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiRequestError, getCharacterPage } from './api/rickAndMortyApi.ts'
import type { Character, CharacterStatus } from './types.ts'

type StatusFilter = CharacterStatus | 'All'

interface CharacterPageInfo {
  count: number
  pages: number
}

function CharacterListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [searchName, setSearchName] = useState('')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [page, setPage] = useState(1)
  const [retryCount, setRetryCount] = useState(0)
  const [characters, setCharacters] = useState<Character[]>([])
  const [pageInfo, setPageInfo] = useState<CharacterPageInfo>({ count: 0, pages: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextName = searchInput.trim()
      setSearchName((currentName) => (currentName === nextName ? currentName : nextName))
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    let isCurrentRequest = true

    async function loadCharacters() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const result = await getCharacterPage({
          name: searchName || undefined,
          status: status === 'All' ? undefined : status,
          page,
        })

        if (!isCurrentRequest) return
        setCharacters(result.results)
        setPageInfo({ count: result.info.count, pages: result.info.pages })
      } catch (error: unknown) {
        if (!isCurrentRequest) return

        if (error instanceof ApiRequestError && error.statusCode === 404) {
          setCharacters([])
          setPageInfo({ count: 0, pages: 0 })
          return
        }

        setCharacters([])
        setPageInfo({ count: 0, pages: 0 })
        setErrorMessage('The character directory could not load. Check your connection and try again.')
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    void loadCharacters()

    return () => {
      isCurrentRequest = false
    }
  }, [page, retryCount, searchName, status])

  function updateSearch(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  function updateStatus(value: StatusFilter) {
    setStatus(value)
    setPage(1)
  }

  const showingResults = !isLoading && errorMessage === null && characters.length > 0

  return (
    <section className="character-directory" aria-labelledby="characters-title">
      <div className="directory-heading">
        <div>
          <p className="page-eyebrow">Character directory</p>
          <h1 className="page-title" id="characters-title">Characters</h1>
          <p className="page-description">
            Search the multiverse and open a character file to learn more.
          </p>
        </div>
        {showingResults && (
          <p className="result-count" aria-live="polite">
            {pageInfo.count} {pageInfo.count === 1 ? 'character' : 'characters'} found
          </p>
        )}
      </div>

      <div className="directory-controls">
        <label className="field-label search-field">
          <span>Search by name</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Try Rick or Morty"
          />
        </label>
        <label className="field-label status-field">
          <span>Filter by status</span>
          <select
            value={status}
            onChange={(event) => updateStatus(event.target.value as StatusFilter)}
          >
            <option value="All">All statuses</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>

      {isLoading && (
        <p className="directory-message" role="status">Loading characters…</p>
      )}

      {!isLoading && errorMessage && (
        <div className="directory-message error-message" role="alert">
          <h2>Something went wrong</h2>
          <p>{errorMessage}</p>
          <button className="secondary-button" type="button" onClick={() => setRetryCount((current) => current + 1)}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && characters.length === 0 && (
        <div className="directory-message" role="status">
          <h2>No characters found</h2>
          <p>Try another name or choose a different status.</p>
        </div>
      )}

      {!isLoading && !errorMessage && characters.length > 0 && (
        <>
          <ul className="character-grid" aria-label="Character results">
            {characters.map((character) => (
              <li className="character-card" key={character.id}>
                <Link className="character-card-link" to={`/characters/${character.id}`}>
                  <img className="character-image" src={character.image} alt="" loading="lazy" />
                  <div className="character-card-content">
                    <span className={`status-indicator status-${character.status.toLowerCase()}`}>
                      <span aria-hidden="true" />
                      {character.status}
                    </span>
                    <h2>{character.name}</h2>
                    <p>{character.gender}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <nav className="pagination" aria-label="Character pages">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <span aria-live="polite">Page {page} of {pageInfo.pages}</span>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setPage((current) => Math.min(pageInfo.pages, current + 1))}
              disabled={page >= pageInfo.pages || isLoading}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  )
}

export default CharacterListPage
