import { Link } from 'react-router-dom'
import type { Character } from './types.ts'
import { useFavorites } from './FavoritesContext.ts'
import CharacterImage from './CharacterImage.tsx'

interface CharacterCardProps {
  character: Character
}

function CharacterCard({ character }: CharacterCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(character.id)

  return (
    <article className="character-card">
      <Link className="character-card-link" to={`/characters/${character.id}`}>
        <CharacterImage className="character-image" src={character.image} alt="" />
        <div className="character-card-content">
          <span className={`status-indicator status-${character.status.toLowerCase()}`}>
            <span aria-hidden="true" />
            {character.status}
          </span>
          <h2>{character.name}</h2>
          <p>{character.gender}</p>
        </div>
      </Link>
      <button
        className={`favorite-toggle-button${favorite ? ' is-favorite' : ''}`}
        type="button"
        aria-label={`${favorite ? 'Remove' : 'Add'} ${character.name} ${favorite ? 'from' : 'to'} favorites`}
        aria-pressed={favorite}
        onClick={() => toggleFavorite(character)}
      >
        {favorite ? '★ Saved' : '☆ Save'}
      </button>
    </article>
  )
}

export default CharacterCard
