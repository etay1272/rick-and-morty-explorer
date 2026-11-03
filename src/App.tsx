import { Link, NavLink, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { parseCharacterId } from './routes.ts'
import './App.css'

function CharactersPage() {
  return (
    <PagePlaceholder
      eyebrow="Character directory"
      title="Characters"
      description="Search and explore the people and creatures of the multiverse."
    />
  )
}

function CharacterDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const characterId = parseCharacterId(id)

  return (
    <PagePlaceholder
      eyebrow="Character file"
      title="Character details"
      description={
        characterId === null
          ? 'This character address has an invalid ID.'
          : `Character ID: ${characterId}. Full details will be added in a later task.`
      }
    />
  )
}

function FavoritesPage() {
  return (
    <PagePlaceholder
      eyebrow="Your collection"
      title="Favorites"
      description="Characters you save will be collected here."
    />
  )
}

function EpisodesPage() {
  return (
    <PagePlaceholder
      eyebrow="Episode guide"
      title="Episodes"
      description="Browse the episodes and find out who appeared in them."
    />
  )
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

interface PagePlaceholderProps {
  eyebrow: string
  title: string
  description: string
}

function PagePlaceholder({ eyebrow, title, description }: PagePlaceholderProps) {
  return (
    <section className="page-panel">
      <p className="page-eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </section>
  )
}

function App() {
  return (
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
  )
}

export default App
