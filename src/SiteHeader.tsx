import { Link, NavLink } from 'react-router-dom'

function SiteHeader() {
  return (
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
  )
}

export default SiteHeader
