import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiClock, FiTarget } from 'react-icons/fi';

/**
 * Sidebar - Navigation sidebar with active link highlighting
 */
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const links = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/add-exercise', icon: <FiPlusCircle />, label: 'Add Exercise' },
    { to: '/history', icon: <FiClock />, label: 'Workout History' },
    { to: '/goals', icon: <FiTarget />, label: 'Goals' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="modal-overlay" style={{ zIndex: 850 }} onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="main-sidebar">
        <div className="sidebar-section-title">Main Menu</div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={onClose}
              id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section-title" style={{ marginTop: '32px' }}>Quick Stats</div>
        <div style={{
          padding: '16px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            💡 Pro Tip
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Consistency is key! Try to exercise at least 30 minutes every day for best results.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
