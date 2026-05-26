import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiMenu, FiLogOut } from 'react-icons/fi';

/**
 * Navbar - Top navigation with theme toggle and user menu
 */
const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Get user initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar" id="main-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <div className="navbar-brand">
          <div className="brand-icon">🏋️</div>
          <span>FitTrack</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" id="theme-toggle-btn">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        <div className="user-menu">
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{user?.name}</span>
        </div>

        <button className="btn-logout" onClick={logout} id="logout-btn">
          <FiLogOut style={{ marginRight: '4px' }} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
