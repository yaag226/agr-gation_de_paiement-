import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  ShoppingBag,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Store,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilter, setUserFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, usersRes, paymentsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers(),
        adminAPI.getAllPayments()
      ]);

      setDashboard(dashboardRes.data.dashboard);
      setUsers(usersRes.data.users);
      setPayments(paymentsRes.data.payments);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner message="Chargement du tableau de bord admin..." />
      </>
    );
  }

  const COLORS = ['#EF2B2D', '#009E49', '#FCD116', '#0EA5E9'];

  const activityChartData = dashboard.charts.recentActivity.map((item) => ({
    date: format(new Date(item._id), 'dd MMM', { locale: fr }),
    montant: item.total,
    transactions: item.count
  }));

  const paymentMethodsData = dashboard.charts.paymentsByMethod.map((method) => ({
    name: method._id,
    value: method.total,
    count: method.count
  }));

  const filteredUsers = users.filter((user) => {
    const matchRole = !roleFilter || user.role === roleFilter;
    const matchSearch =
      !searchTerm ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <Shield size={32} style={{ verticalAlign: 'middle' }} />
              {' '}Tableau de bord Administrateur
            </h1>
            <p style={styles.subtitle}>Vue d'ensemble complète de la plateforme</p>
          </div>
        </div>

        {/* Onglets */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={activeTab === 'overview' ? styles.tabActive : styles.tab}
          >
            <Activity size={18} />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={activeTab === 'users' ? styles.tabActive : styles.tab}
          >
            <Users size={18} />
            Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={activeTab === 'transactions' ? styles.tabActive : styles.tab}
          >
            <TrendingUp size={18} />
            Transactions ({payments.length})
          </button>
        </div>

        {/* VUE D'ENSEMBLE */}
        {activeTab === 'overview' && (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-4">
              <StatCard
                icon={Users}
                title="Total utilisateurs"
                value={dashboard.users.total}
                color="var(--bf-green)"
              />
              <StatCard
                icon={ShoppingBag}
                title="Total marchands"
                value={dashboard.users.merchants}
                color="var(--bf-red)"
              />
              <StatCard
                icon={Activity}
                title="Transactions"
                value={dashboard.payments.total}
                color="var(--bf-yellow)"
              />
              <StatCard
                icon={DollarSign}
                title="Volume traité"
                value={dashboard.financial.totalProcessed.toLocaleString()}
                suffix="FCFA"
                color="var(--status-success)"
              />
            </div>

            {/* Statistiques détaillées */}
            <div className="grid grid-2">
              {/* Utilisateurs */}
              <div className="card">
                <h2 style={styles.sectionTitle}>Statistiques utilisateurs</h2>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <Users size={24} color="var(--bf-green)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.users.clients}</p>
                      <p style={styles.statLabel}>Clients</p>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <Store size={24} color="var(--bf-red)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.users.merchants}</p>
                      <p style={styles.statLabel}>Marchands</p>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <UserCheck size={24} color="var(--status-success)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.users.active}</p>
                      <p style={styles.statLabel}>Actifs</p>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <UserX size={24} color="var(--text-secondary)" />
                    <div>
                      <p style={styles.statValue}>
                        {dashboard.users.total - dashboard.users.active}
                      </p>
                      <p style={styles.statLabel}>Inactifs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paiements */}
              <div className="card">
                <h2 style={styles.sectionTitle}>Statistiques paiements</h2>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <CheckCircle size={24} color="var(--status-success)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.payments.success}</p>
                      <p style={styles.statLabel}>Réussis</p>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <XCircle size={24} color="var(--status-error)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.payments.failed}</p>
                      <p style={styles.statLabel}>Échoués</p>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <Clock size={24} color="var(--status-pending)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.payments.pending}</p>
                      <p style={styles.statLabel}>En attente</p>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <TrendingUp size={24} color="var(--bf-green)" />
                    <div>
                      <p style={styles.statValue}>{dashboard.payments.successRate}%</p>
                      <p style={styles.statLabel}>Taux réussite</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-2">
              {/* Évolution des transactions */}
              <div className="card">
                <h2 style={styles.sectionTitle}>
                  Évolution des transactions (30 jours)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => [
                        name === 'montant'
                          ? `${value.toLocaleString()} FCFA`
                          : value,
                        name === 'montant' ? 'Montant' : 'Transactions'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="montant" fill="var(--bf-green)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="transactions" fill="var(--bf-red)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Méthodes de paiement */}
              <div className="card">
                <h2 style={styles.sectionTitle}>Répartition par méthode</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} FCFA`}
                      contentStyle={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top marchands */}
            <div className="card">
              <h2 style={styles.sectionTitle}>Top 5 Marchands</h2>
              <div style={styles.merchantsList}>
                {dashboard.topMerchants.map((merchant, index) => (
                  <div key={merchant._id} style={styles.merchantItem}>
                    <div style={styles.merchantRank}>#{index + 1}</div>
                    <Store size={20} color="var(--bf-green)" />
                    <div style={styles.merchantInfo}>
                      <p style={styles.merchantName}>{merchant.businessName}</p>
                      <p style={styles.merchantStats}>
                        {merchant.transactionCount} transactions
                      </p>
                    </div>
                    <div style={styles.merchantAmount}>
                      <span className="amount-fcfa">
                        {merchant.totalReceived.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions récentes */}
            <div className="card">
              <h2 style={styles.sectionTitle}>Dernières transactions</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Marchand</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentTransactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction._id}>
                        <td>
                          {format(
                            new Date(transaction.createdAt),
                            'dd MMM yyyy HH:mm',
                            { locale: fr }
                          )}
                        </td>
                        <td>
                          {transaction.client.firstName} {transaction.client.lastName}
                        </td>
                        <td>{transaction.merchant.businessName}</td>
                        <td>
                          <span className="amount-fcfa">
                            {transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={transaction.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* GESTION DES UTILISATEURS */}
        {activeTab === 'users' && (
          <>
            {/* Filtres */}
            <div className="card" style={styles.filters}>
              <div style={styles.searchBar}>
                <Search size={18} style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.roleFilters}>
                <Filter size={18} />
                <button
                  onClick={() => setRoleFilter('')}
                  style={roleFilter === '' ? styles.filterActive : styles.filterButton}
                >
                  Tous
                </button>
                <button
                  onClick={() => setRoleFilter('client')}
                  style={
                    roleFilter === 'client' ? styles.filterActive : styles.filterButton
                  }
                >
                  Clients
                </button>
                <button
                  onClick={() => setRoleFilter('merchant')}
                  style={
                    roleFilter === 'merchant' ? styles.filterActive : styles.filterButton
                  }
                >
                  Marchands
                </button>
                <button
                  onClick={() => setRoleFilter('admin')}
                  style={
                    roleFilter === 'admin' ? styles.filterActive : styles.filterButton
                  }
                >
                  Admins
                </button>
              </div>
            </div>

            {/* Liste des utilisateurs */}
            <div className="card">
              <h2 style={styles.sectionTitle}>
                Utilisateurs ({filteredUsers.length})
              </h2>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nom complet</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Transactions</th>
                      <th>Inscrit le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <strong>
                            {user.firstName} {user.lastName}
                          </strong>
                          {user.businessName && (
                            <div style={styles.businessName}>
                              <Store size={14} />
                              {user.businessName}
                            </div>
                          )}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <RoleBadge role={user.role} />
                        </td>
                        <td>
                          {user.isActive ? (
                            <span className="badge badge-success">
                              <UserCheck size={14} />
                              Actif
                            </span>
                          ) : (
                            <span className="badge badge-error">
                              <UserX size={14} />
                              Inactif
                            </span>
                          )}
                        </td>
                        <td>{user.transactionCount || 0}</td>
                        <td>
                          {format(new Date(user.createdAt), 'dd MMM yyyy', {
                            locale: fr
                          })}
                        </td>
                        <td>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => toggleUserStatus(user._id)}
                              className={
                                user.isActive ? 'btn btn-outline' : 'btn btn-success'
                              }
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              {user.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="card">
            <h2 style={styles.sectionTitle}>
              Toutes les transactions ({payments.length})
            </h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Marchand</th>
                    <th>Méthode</th>
                    <th>Montant</th>
                    <th>Frais</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td style={styles.transactionId}>{payment.transactionId}</td>
                      <td>
                        {format(
                          new Date(payment.createdAt),
                          'dd MMM yyyy HH:mm',
                          { locale: fr }
                        )}
                      </td>
                      <td>
                        {payment.client.firstName} {payment.client.lastName}
                      </td>
                      <td>{payment.merchant.businessName}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>
                        <span className="amount-fcfa">
                          {payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ color: 'var(--status-error)' }}>
                        {payment.fees.toLocaleString()} FCFA
                      </td>
                      <td>
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

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

const RoleBadge = ({ role }) => {
  const config = {
    admin: { label: '👑 Admin', color: 'var(--bf-red)' },
    merchant: { label: '🏪 Marchand', color: 'var(--bf-green)' },
    client: { label: '👤 Client', color: 'var(--bf-yellow)' }
  };

  const { label, color } = config[role] || config.client;

  return (
    <span
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        background: `${color}20`,
        color: color
      }}
    >
      {label}
    </span>
  );
};

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1600px',
    margin: '0 auto'
  },
  header: {
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
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '2px solid var(--border-color)',
    paddingBottom: '8px'
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease'
  },
  tabActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'var(--bf-green)',
    color: 'white',
    border: 'none',
    borderRadius: '8px 8px 0 0',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderRadius: '12px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  merchantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  merchantItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderRadius: '12px'
  },
  merchantRank: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--bf-yellow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700'
  },
  merchantInfo: {
    flex: 1
  },
  merchantName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  merchantStats: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  merchantAmount: {
    fontSize: '18px',
    fontWeight: '700'
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
    minWidth: '300px'
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
  roleFilters: {
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
  businessName: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  transactionId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  }
};

export default AdminDashboard;