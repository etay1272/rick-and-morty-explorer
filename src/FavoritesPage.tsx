import { Link } from 'react-router-dom'
import CharacterCard from './CharacterCard.tsx'
import { useFavorites } from './FavoritesContext.ts'

function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <section className="character-directory" aria-labelledby="favorites-title">
      <div className="directory-heading">
        <div>
          <p className="page-eyebrow">Your collection</p>
          <h1 className="page-title" id="favorites-title">Favorites</h1>
          <p className="page-description">Your saved characters, ready for another visit.</p>
        </div>
        {favorites.length > 0 && (
          <p className="result-count">
            {favorites.length} {favorites.length === 1 ? 'character' : 'characters'} saved
          </p>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="directory-message">
          <h2>No favorites yet</h2>
          <p>Save a character from the directory or their character file to see them here.</p>
          <Link className="return-link" to="/characters">Explore characters</Link>
        </div>
      ) : (
        <ul className="character-grid" aria-label="Favorite characters">
          {favorites.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default FavoritesPage
