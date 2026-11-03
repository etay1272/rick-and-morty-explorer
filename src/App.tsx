import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { parseCharacterId } from './routes.ts'
import './App.css'

function CharactersPage() {
  return (
    <section>
      <h1>Characters</h1>
      <p>The character list will be built in a later task.</p>
    </section>
  )
}

function CharacterDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const characterId = parseCharacterId(id)

  return (
    <section>
      <h1>Character details</h1>
      {characterId === null ? (
        <p role="alert">This character URL has an invalid ID.</p>
      ) : (
        <p>Character ID: {characterId}</p>
      )}
    </section>
  )
}

function FavoritesPage() {
  return (
    <section>
      <h1>Favorites</h1>
      <p>Your saved characters will appear here.</p>
    </section>
  )
}

function EpisodesPage() {
  return (
    <section>
      <h1>Episodes</h1>
      <p>The episode list will be built in a later task.</p>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>This address does not match a page in the app.</p>
      <Link to="/characters">Go to characters</Link>
    </section>
  )
}

function App() {
  return (
    <>
      <nav className="app-nav" aria-label="Main navigation">
        <Link to="/characters">Characters</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/episodes">Episodes</Link>
      </nav>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/characters" replace />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:id" element={<CharacterDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/episodes" element={<EpisodesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
