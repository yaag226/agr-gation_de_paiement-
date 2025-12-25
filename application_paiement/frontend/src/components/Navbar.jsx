import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'merchant':
        return '/merchant/dashboard';
      case 'client':
        return '/client/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContent}>
        <Link to={getDashboardLink()} style={styles.logo}>
          <div className="bf-flag"></div>
          <span style={styles.logoText}>PayBF</span>
          <span style={styles.logoSubtext}>Aggregator</span>
        </Link>

        <div style={styles.navRight}>
          <Link to={getDashboardLink()} style={styles.navLink}>
            <Home size={18} />
            <span>Accueil</span>
          </Link>

          {user && (
            <>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  <User size={18} />
                </div>
                <div style={styles.userDetails}>
                  <span style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span style={styles.userRole}>{getRoleLabel(user.role)}</span>
                </div>
              </div>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const getRoleLabel = (role) => {
  const labels = {
    admin: '👑 Administrateur',
    merchant: '🏪 Marchand',
    client: '👤 Client'
  };
  return labels[role] || role;
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, var(--bf-green) 0%, var(--bf-green-dark) 100%)',
    boxShadow: 'var(--shadow-lg)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: 'white'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  logoSubtext: {
    fontSize: '12px',
    fontWeight: '600',
    background: 'var(--bf-yellow)',
    color: 'var(--text-primary)',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'background 0.2s ease',
    fontWeight: '600'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--bf-yellow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px'
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'var(--bf-red)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default Navbar;