import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import CharacterListPage from './CharacterListPage.tsx'
import CharacterDetailsPage from './CharacterDetailsPage.tsx'
import FavoritesPage from './FavoritesPage.tsx'
import EpisodesPage from './EpisodesPage.tsx'
import { FavoritesProvider } from './FavoritesProvider.tsx'
import './App.css'

function CharactersPage() {
  return <CharacterListPage />
}

function NotFoundPage() {
  return (
    <section className="page-panel">
      <p className="page-eyebrow">Unknown coordinates</p>
      <h1 className="page-title">Page not found</h1>
      <p className="page-description">That address does not point to a page in this guide.</p>
      <Link className="return-link" to="/characters">
        Return to characters
      </Link>
    </section>
  )
}

function App() {
  return (
    <FavoritesProvider>
      <div className="app-shell">
        <header className="site-header">
          <Link className="brand" to="/characters" aria-label="Rick and Morty Explorer home">
            <span className="brand-orbit" aria-hidden="true" />
            <span>
              <span className="brand-kicker">Interdimensional field guide</span>
              <span className="brand-name">Rick &amp; Morty Explorer</span>
            </span>
          </Link>

          <nav className="primary-nav" aria-label="Main navigation">
            <NavLink className="primary-nav-link" to="/characters">
              Characters
            </NavLink>
            <NavLink className="primary-nav-link" to="/favorites">
              Favorites
            </NavLink>
            <NavLink className="primary-nav-link" to="/episodes">
              Episodes
            </NavLink>
          </nav>
        </header>

        <main className="app-main" id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Navigate to="/characters" replace />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/characters/:id" element={<CharacterDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/episodes" element={<EpisodesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <span>Rick &amp; Morty Explorer</span>
          <span>Fan-made field guide</span>
        </footer>
      </div>
    </FavoritesProvider>
  )
}

export default App
