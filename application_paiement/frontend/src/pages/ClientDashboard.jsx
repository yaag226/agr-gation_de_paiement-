import { useState, useEffect } from 'react';
import { clientAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Wallet, 
  TrendingUp, 
  Activity, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Store
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, paymentsRes, merchantsRes] = await Promise.all([
        clientAPI.getStats(),
        clientAPI.getPayments(),
        clientAPI.getMerchants()
      ]);

      setStats(statsRes.data.stats);
      setPayments(paymentsRes.data.payments);
      setMerchants(merchantsRes.data.merchants);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchStatus = !filterStatus || payment.status === filterStatus;
    const matchSearch = !searchTerm || 
      payment.merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner message="Chargement de votre tableau de bord..." />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Tableau de bord Client</h1>
            <p style={styles.subtitle}>Gérez vos paiements et transactions</p>
          </div>
          <button 
            className="btn btn-success"
            onClick={() => setShowPaymentModal(true)}
          >
            <Plus size={18} />
            <span>Nouveau paiement</span>
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-4">
          <StatCard
            icon={Wallet}
            title="Total dépensé"
            value={stats?.totalSpent?.toLocaleString() || '0'}
            suffix="FCFA"
            color="var(--bf-green)"
          />
          <StatCard
            icon={Activity}
            title="Transactions"
            value={stats?.byStatus?.reduce((acc, s) => acc + s.count, 0) || 0}
            color="var(--bf-red)"
          />
          <StatCard
            icon={CheckCircle}
            title="Réussies"
            value={stats?.byStatus?.find(s => s._id === 'SUCCESS')?.count || 0}
            color="var(--status-success)"
          />
          <StatCard
            icon={TrendingUp}
            title="Taux de réussite"
            value={calculateSuccessRate(stats?.byStatus)}
            suffix="%"
            color="var(--bf-yellow)"
          />
        </div>

        {/* Filtres */}
        <div className="card" style={styles.filters}>
          <div style={styles.searchBar}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un marchand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.statusFilters}>
            <Filter size={18} />
            <button
              onClick={() => setFilterStatus('')}
              style={filterStatus === '' ? styles.filterActive : styles.filterButton}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatus('SUCCESS')}
              style={filterStatus === 'SUCCESS' ? styles.filterActive : styles.filterButton}
            >
              Réussis
            </button>
            <button
              onClick={() => setFilterStatus('FAILED')}
              style={filterStatus === 'FAILED' ? styles.filterActive : styles.filterButton}
            >
              Échoués
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              style={filterStatus === 'PENDING' ? styles.filterActive : styles.filterButton}
            >
              En attente
            </button>
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="card">
          <h2 style={styles.sectionTitle}>Historique des paiements</h2>
          
          {filteredPayments.length === 0 ? (
            <div style={styles.emptyState}>
              <Wallet size={48} color="var(--text-light)" />
              <p>Aucun paiement trouvé</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Marchand</th>
                    <th>Méthode</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment._id}>
                      <td>{format(new Date(payment.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}</td>
                      <td>
                        <div style={styles.merchantCell}>
                          <Store size={16} />
                          <span>{payment.merchant.businessName}</span>
                        </div>
                      </td>
                      <td>{payment.paymentMethod}</td>
                      <td>
                        <span className="amount-fcfa">
                          {payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={payment.status} />
                      </td>
                      <td style={styles.transactionId}>{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          merchants={merchants}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            loadData();
          }}
        />
      )}
    </>
  );
};

// Composant Modal de Paiement
const PaymentModal = ({ merchants, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    merchantId: '',
    amount: '',
    paymentMethod: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation du montant
    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount < 100) {
      setError('Le montant minimum est de 100 FCFA');
      setLoading(false);
      return;
    }

    // Validation du marchand
    if (!formData.merchantId) {
      setError('Veuillez sélectionner un marchand');
      setLoading(false);
      return;
    }

    // Validation de la méthode de paiement
    if (!formData.paymentMethod) {
      setError('Veuillez sélectionner une méthode de paiement');
      setLoading(false);
      return;
    }

    try {
      const response = await clientAPI.createPayment({
        ...formData,
        amount
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div style={styles.successMessage}>
            <CheckCircle size={64} color="var(--status-success)" />
            <h2>Paiement effectué !</h2>
            <p>Votre transaction a été traitée avec succès</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nouveau paiement</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="alert alert-error">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Marchand</label>
            <select
              value={formData.merchantId}
              onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
              required
            >
              <option value="">Sélectionner un marchand</option>
              {merchants.map(merchant => (
                <option key={merchant._id} value={merchant._id}>
                  {merchant.businessName} - {merchant.businessCategory}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Montant (FCFA)</label>
            <input
              type="number"
              min="100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Ex: 5000"
              required
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Montant minimum: 100 FCFA
            </small>
          </div>

          <div className="input-group">
            <label>Méthode de paiement</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              required
            >
              <option value="">Sélectionner</option>
              <option value="Orange Money">🟠 Orange Money</option>
              <option value="Moov Money">🔵 Moov Money</option>
              <option value="Wave">💙 Wave</option>
              <option value="Coris Money">🟡 Coris Money</option>
              <option value="Carte Bancaire">💳 Carte Bancaire</option>
            </select>
          </div>

          <div className="input-group">
            <label>Description (optionnel)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Motif du paiement..."
            />
          </div>

          <div style={styles.modalActions}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Payer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant Badge de statut
const StatusBadge = ({ status }) => {
  const config = {
    SUCCESS: { icon: CheckCircle, label: 'Réussi', className: 'badge-success' },
    FAILED: { icon: XCircle, label: 'Échoué', className: 'badge-error' },
    PENDING: { icon: Clock, label: 'En attente', className: 'badge-pending' }
  };

  const { icon: Icon, label, className } = config[status] || config.PENDING;

  return (
    <span className={`badge ${className}`}>
      <Icon size={14} />
      {label}
    </span>
  );
};

// Fonction utilitaire
const calculateSuccessRate = (byStatus) => {
  if (!byStatus || byStatus.length === 0) return '0';
  const total = byStatus.reduce((acc, s) => acc + s.count, 0);
  const success = byStatus.find(s => s._id === 'SUCCESS')?.count || 0;
  return total > 0 ? ((success / total) * 100).toFixed(1) : '0';
};

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)'
  },
  filters: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  searchBar: {
    position: 'relative',
    flex: 1,
    minWidth: '250px'
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px'
  },
  statusFilters: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  filterButton: {
    padding: '8px 16px',
    background: 'var(--bg-secondary)',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  filterActive: {
    padding: '8px 16px',
    background: 'var(--bf-green)',
    color: 'white',
    border: '2px solid var(--bf-green)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '24px',
    color: 'var(--text-primary)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)'
  },
  merchantCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  transactionId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  successMessage: {
    textAlign: 'center',
    padding: '40px'
  }
};

export default ClientDashboard;