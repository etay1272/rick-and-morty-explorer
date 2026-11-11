import { Link, Navigate, Route, Routes } from 'react-router-dom'
import CharacterListPage from './CharacterListPage.tsx'
import CharacterDetailsPage from './CharacterDetailsPage.tsx'
import FavoritesPage from './FavoritesPage.tsx'
import EpisodesPage from './EpisodesPage.tsx'
import { FavoritesProvider } from './FavoritesProvider.tsx'
import SiteHeader from './SiteHeader.tsx'
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
        <SiteHeader />

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
