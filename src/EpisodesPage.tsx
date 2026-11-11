import { useEffect, useState } from 'react'
import { ApiRequestError, getEpisodePage } from './api/rickAndMortyApi.ts'
import type { Episode } from './types.ts'
import { formatEpisodeCode } from './utils/episodes.ts'

interface EpisodePageInfo {
  count: number
  pages: number
}

function EpisodesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [searchName, setSearchName] = useState('')
  const [page, setPage] = useState(1)
  const [retryCount, setRetryCount] = useState(0)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [pageInfo, setPageInfo] = useState<EpisodePageInfo>({ count: 0, pages: 0 })
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

    async function loadEpisodes() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const result = await getEpisodePage({ name: searchName || undefined, page })
        if (!isCurrentRequest) return
        setEpisodes(result.results)
        setPageInfo({ count: result.info.count, pages: result.info.pages })
      } catch (error: unknown) {
        if (!isCurrentRequest) return

        setEpisodes([])
        setPageInfo({ count: 0, pages: 0 })
        if (error instanceof ApiRequestError && error.statusCode === 404) return

        setErrorMessage('The episode guide could not load. Check your connection and try again.')
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    void loadEpisodes()

    return () => {
      isCurrentRequest = false
    }
  }, [page, retryCount, searchName])

  function updateSearch(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  const showingResults = !isLoading && errorMessage === null && episodes.length > 0

  return (
    <section className="character-directory" aria-labelledby="episodes-title">
      <div className="directory-heading">
        <div>
          <p className="page-eyebrow">Episode guide</p>
          <h1 className="page-title" id="episodes-title">Episodes</h1>
          <p className="page-description">Search the series and see when each episode aired.</p>
        </div>
        {showingResults && (
          <p className="result-count" aria-live="polite">
            {pageInfo.count} {pageInfo.count === 1 ? 'episode' : 'episodes'} found
          </p>
        )}
      </div>

      <div className="directory-controls episode-controls">
        <label className="field-label">
          <span>Search by episode name</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Try Pilot"
          />
        </label>
      </div>

      {isLoading && <p className="directory-message" role="status">Loading episodes…</p>}

      {!isLoading && errorMessage && (
        <div className="directory-message error-message" role="alert">
          <h2>Something went wrong</h2>
          <p>{errorMessage}</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => setRetryCount((current) => current + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && episodes.length === 0 && (
        <div className="directory-message" role="status">
          <h2>No episodes found</h2>
          <p>Try another episode name.</p>
        </div>
      )}

      {!isLoading && !errorMessage && episodes.length > 0 && (
        <>
          <ol className="episode-guide-list" aria-label="Episode results">
            {episodes.map((episode) => (
              <li className="episode-guide-card" key={episode.id}>
                <span className="episode-guide-code">{formatEpisodeCode(episode.episode)}</span>
                <div className="episode-guide-details">
                  <h2>{episode.name}</h2>
                  <p>{episode.air_date}</p>
                  <span>{episode.characters.length} character appearances</span>
                </div>
              </li>
            ))}
          </ol>

          <nav className="pagination" aria-label="Episode pages">
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

export default EpisodesPage
