import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'merchant':
          navigate('/merchant/dashboard');
          break;
        case 'client':
          navigate('/client/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  // Comptes de test
  const testAccounts = [
    { email: 'admin@payment-bf.com', password: 'admin123', role: 'Admin' },
    { email: 'amadou@boutique.bf', password: 'merchant123', role: 'Marchand' },
    { email: 'salif@email.com', password: 'client123', role: 'Client' }
  ];

  const fillTestAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.branding}>
          <div className="bf-flag" style={{ width: '48px', height: '32px' }}></div>
          <h1 style={styles.brandTitle}>PayBF Aggregator</h1>
          <p style={styles.brandSubtitle}>Plateforme d'agrégation de paiement</p>
        </div>

        <div style={styles.features}>
          <h3 style={styles.featuresTitle}>🇧🇫 Pourquoi PayBF ?</h3>
          <ul style={styles.featuresList}>
            <li>✅ Paiements sécurisés en FCFA</li>
            <li>✅ Support Orange Money, Moov, Wave</li>
            <li>✅ Tableau de bord en temps réel</li>
            <li>✅ Frais compétitifs (1.5%)</li>
            <li>✅ Service client 24/7</li>
          </ul>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Connexion</h2>
          <p style={styles.formSubtitle}>Bienvenue sur PayBF ! Connectez-vous pour continuer</p>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="input-group">
              <label>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success" disabled={loading} style={{ width: '100%' }}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span>ou</span>
          </div>

          <div style={styles.testAccounts}>
            <p style={styles.testTitle}>🧪 Comptes de test :</p>
            <div style={styles.testButtons}>
              {testAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillTestAccount(account)}
                  style={styles.testButton}
                  className="btn btn-outline"
                >
                  {account.role}
                </button>
              ))}
            </div>
          </div>

          <p style={styles.registerLink}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={styles.link}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh'
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, var(--bf-green) 0%, var(--bf-green-dark) 100%)',
    padding: '60px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  branding: {
    marginBottom: '60px'
  },
  brandTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginTop: '20px',
    marginBottom: '12px'
  },
  brandSubtitle: {
    fontSize: '18px',
    opacity: 0.9
  },
  features: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '32px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)'
  },
  featuresTitle: {
    fontSize: '24px',
    marginBottom: '24px'
  },
  featuresList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontSize: '16px',
    lineHeight: '1.6'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'var(--bg-secondary)'
  },
  formContainer: {
    width: '100%',
    maxWidth: '480px',
    background: 'var(--bg-primary)',
    padding: '48px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)'
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'var(--text-primary)'
  },
  formSubtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '32px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)'
  },
  inputWithIcon: {
    paddingLeft: '48px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },
  testAccounts: {
    background: 'var(--bg-secondary)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  testTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'var(--text-secondary)'
  },
  testButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  testButton: {
    fontSize: '12px',
    padding: '8px 12px'
  },
  registerLink: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  link: {
    color: 'var(--bf-green)',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Login;