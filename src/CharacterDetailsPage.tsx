import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiRequestError, getCharacterById, getEpisodesByIds } from './api/rickAndMortyApi.ts'
import type { Character, Episode } from './types.ts'
import { formatEpisodeCode } from './utils/episodes.ts'
import { parseCharacterId } from './routes.ts'

function CharacterDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const characterId = parseCharacterId(id)
  const [character, setCharacter] = useState<Character | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [hasEpisodeError, setHasEpisodeError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadCharacter() {
      setCharacter(null)
      setEpisodes([])
      setIsNotFound(false)
      setHasEpisodeError(false)
      setErrorMessage(null)

      if (characterId === null) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      let loadedCharacter: Character
      try {
        loadedCharacter = await getCharacterById(characterId)
      } catch (error: unknown) {
        if (!isCurrentRequest) return
        if (error instanceof ApiRequestError && error.statusCode === 404) {
          setIsNotFound(true)
        } else {
          setErrorMessage('The character file could not load. Check your connection and try again.')
        }
        setIsLoading(false)
        return
      }

      if (!isCurrentRequest) return
      setCharacter(loadedCharacter)

      const episodeIds = loadedCharacter.episode
        .map((url) => Number(url.match(/\/(\d+)\/?$/)?.[1]))
        .filter((episodeId) => Number.isSafeInteger(episodeId) && episodeId > 0)

      try {
        const loadedEpisodes = await getEpisodesByIds(episodeIds)
        if (isCurrentRequest) setEpisodes(loadedEpisodes)
      } catch {
        if (isCurrentRequest) setHasEpisodeError(true)
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    void loadCharacter()

    return () => {
      isCurrentRequest = false
    }
  }, [characterId, retryCount])

  if (characterId === null) {
    return (
      <DetailsMessage
        eyebrow="Character file"
        title="Invalid character ID"
        description="Character addresses must use a positive whole number."
      />
    )
  }

  if (isLoading) {
    return <p className="directory-message" role="status">Loading character file…</p>
  }

  if (errorMessage) {
    return (
      <DetailsMessage
        eyebrow="Character file"
        title="Unable to load character"
        description={errorMessage}
        onRetry={() => setRetryCount((current) => current + 1)}
      />
    )
  }

  if (isNotFound || !character) {
    return (
      <DetailsMessage
        eyebrow="Character file"
        title="Character not found"
        description={`There is no character with ID ${characterId}.`}
      />
    )
  }

  return (
    <article className="character-details" aria-labelledby="character-name">
      <Link className="return-link details-back-link" to="/characters">← Back to characters</Link>
      <div className="character-profile">
        <img className="character-profile-image" src={character.image} alt={character.name} />
        <div className="character-profile-content">
          <p className="page-eyebrow">Character file · #{character.id}</p>
          <h1 className="page-title" id="character-name">{character.name}</h1>
          <p className="character-profile-summary">
            {character.species}{character.type ? ` · ${character.type}` : ''}
          </p>
          <dl className="character-facts">
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`status-indicator status-${character.status.toLowerCase()}`}>
                  <span aria-hidden="true" />
                  {character.status}
                </span>
              </dd>
            </div>
            <div><dt>Gender</dt><dd>{character.gender}</dd></div>
            <div><dt>Origin</dt><dd>{character.origin.name}</dd></div>
            <div><dt>Last known location</dt><dd>{character.location.name}</dd></div>
          </dl>
        </div>
      </div>

      <section className="episode-appearances" aria-labelledby="appearances-heading">
        <div className="appearances-heading">
          <div>
            <p className="page-eyebrow">On screen</p>
            <h2 id="appearances-heading">Episode appearances</h2>
          </div>
          <span>{character.episode.length} {character.episode.length === 1 ? 'episode' : 'episodes'}</span>
        </div>

        {hasEpisodeError ? (
          <p className="directory-message" role="status">
            Character details loaded, but episode appearances could not be retrieved.
          </p>
        ) : episodes.length === 0 ? (
          <p className="directory-message">No episode appearances are listed.</p>
        ) : (
          <ul className="episode-list">
            {episodes.map((episode) => (
              <li className="episode-item" key={episode.id}>
                <span className="episode-code">{formatEpisodeCode(episode.episode)}</span>
                <span className="episode-name">{episode.name}</span>
                <span className="episode-date">{episode.air_date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}

interface DetailsMessageProps {
  eyebrow: string
  title: string
  description: string
  onRetry?: () => void
}

function DetailsMessage({ eyebrow, title, description, onRetry }: DetailsMessageProps) {
  return (
    <section className="page-panel">
      <p className="page-eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
      {onRetry && (
        <button className="secondary-button details-retry" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
      <Link className="return-link" to="/characters">Return to characters</Link>
    </section>
  )
}

export default CharacterDetailsPage
