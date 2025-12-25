import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Building, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'client',
    businessName: '',
    businessCategory: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (formData.role === 'merchant' && !formData.businessName) {
      setError('Le nom de l\'entreprise est requis pour les marchands');
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
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

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.branding}>
          <div className="bf-flag" style={{ width: '48px', height: '32px' }}></div>
          <h1 style={styles.brandTitle}>Rejoignez PayBF</h1>
          <p style={styles.brandSubtitle}>
            Créez votre compte et commencez à accepter des paiements en FCFA
          </p>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <h3 style={styles.statValue}>500+</h3>
            <p style={styles.statLabel}>Marchands actifs</p>
          </div>
          <div style={styles.statItem}>
            <h3 style={styles.statValue}>50K+</h3>
            <p style={styles.statLabel}>Transactions</p>
          </div>
          <div style={styles.statItem}>
            <h3 style={styles.statValue}>2.5M+</h3>
            <p style={styles.statLabel}>FCFA traités</p>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Inscription</h2>
          <p style={styles.formSubtitle}>Créez votre compte en quelques secondes</p>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Amadou"
                  required
                />
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ouédraogo"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="amadou@email.com"
                  required
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Téléphone</label>
              <div style={styles.inputWrapper}>
                <Phone size={18} style={styles.inputIcon} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+226 70 12 34 56"
                  required
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Type de compte</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="client">👤 Client</option>
                <option value="merchant">🏪 Marchand</option>
              </select>
            </div>

            {formData.role === 'merchant' && (
              <>
                <div className="input-group">
                  <label>Nom de l'entreprise</label>
                  <div style={styles.inputWrapper}>
                    <Building size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Ma Boutique BF"
                      required={formData.role === 'merchant'}
                      style={styles.inputWithIcon}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Catégorie</label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    required={formData.role === 'merchant'}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Boutique">Boutique</option>
                    <option value="Services">Services</option>
                    <option value="Electronique">Électronique</option>
                    <option value="Mode">Mode</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </>
            )}

            <div style={styles.row}>
              <div className="input-group" style={{ flex: 1 }}>
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

              <div className="input-group" style={{ flex: 1 }}>
                <label>Confirmer</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-success" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Inscription...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          <p style={styles.loginLink}>
            Vous avez déjà un compte ?{' '}
            <Link to="/login" style={styles.link}>
              Se connecter
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
    background: 'linear-gradient(135deg, var(--bf-red) 0%, var(--bf-red-dark) 100%)',
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
    opacity: 0.9,
    lineHeight: '1.6'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px'
  },
  statItem: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '24px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.9
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'var(--bg-secondary)',
    overflowY: 'auto'
  },
  formContainer: {
    width: '100%',
    maxWidth: '600px',
    background: 'var(--bg-primary)',
    padding: '48px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
    margin: '20px 0'
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
  loginLink: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '24px'
  },
  link: {
    color: 'var(--bf-red)',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Register;