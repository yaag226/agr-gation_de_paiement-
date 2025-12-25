import { useState, useEffect } from 'react';
import { merchantAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Wallet,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  CreditCard
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const MerchantDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, paymentsRes] = await Promise.all([
        merchantAPI.getDashboard(),
        merchantAPI.getPayments()
      ]);

      setDashboard(dashboardRes.data.dashboard);
      setPayments(paymentsRes.data.payments);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentsWithFilters = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await merchantAPI.getPayments(params);
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadPaymentsWithFilters();
    }
  }, [statusFilter, dateRange]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner message="Chargement de votre tableau de bord..." />
      </>
    );
  }

  // Préparer les données pour les graphiques
  const revenueChartData = dashboard.recentRevenue.map(item => ({
    date: format(new Date(item._id), 'dd MMM', { locale: fr }),
    montant: item.total,
    transactions: item.count
  }));

  const paymentMethodsData = dashboard.paymentMethods.map(method => ({
    name: method._id,
    value: method.total,
    count: method.count
  }));

  const COLORS = ['#EF2B2D', '#009E49', '#FCD116', '#0EA5E9', '#8B5CF6'];

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Tableau de bord Marchand</h1>
            <p style={styles.subtitle}>Suivez vos performances et transactions</p>
          </div>
          <button className="btn btn-success">
            <Download size={18} />
            <span>Exporter les données</span>
          </button>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-4">
          <StatCard
            icon={Wallet}
            title="Revenus totaux"
            value={dashboard.overview.totalReceived.toLocaleString()}
            suffix="FCFA"
            color="var(--bf-green)"
          />
          <StatCard
            icon={Activity}
            title="Transactions"
            value={dashboard.overview.totalTransactions}
            color="var(--bf-red)"
          />
          <StatCard
            icon={TrendingUp}
            title="Taux de réussite"
            value={dashboard.overview.successRate}
            suffix="%"
            color="var(--status-success)"
          />
          <StatCard
            icon={CheckCircle}
            title="Réussies"
            value={dashboard.statistics.success}
            color="var(--bf-yellow)"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-2">
          {/* Graphique des revenus */}
          <div className="card">
            <h2 style={styles.sectionTitle}>Évolution des revenus (7 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
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
                    name === 'montant' ? `${value.toLocaleString()} FCFA` : value,
                    name === 'montant' ? 'Montant' : 'Transactions'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="montant"
                  stroke="var(--bf-green)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--bf-green)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par méthode de paiement */}
          <div className="card">
            <h2 style={styles.sectionTitle}>Répartition par méthode de paiement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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

        {/* Statistiques détaillées */}
        <div className="card">
          <h2 style={styles.sectionTitle}>Statistiques détaillées</h2>
          <div className="grid grid-4">
            <div style={styles.statBox}>
              <div style={{ ...styles.statIcon, background: 'var(--status-success)' }}>
                <CheckCircle size={24} color="white" />
              </div>
              <div>
                <p style={styles.statLabel}>Paiements réussis</p>
                <p style={styles.statValue}>{dashboard.statistics.success}</p>
              </div>
            </div>

            <div style={styles.statBox}>
              <div style={{ ...styles.statIcon, background: 'var(--status-error)' }}>
                <XCircle size={24} color="white" />
              </div>
              <div>
                <p style={styles.statLabel}>Paiements échoués</p>
                <p style={styles.statValue}>{dashboard.statistics.failed}</p>
              </div>
            </div>

            <div style={styles.statBox}>
              <div style={{ ...styles.statIcon, background: 'var(--status-pending)' }}>
                <Clock size={24} color="white" />
              </div>
              <div>
                <p style={styles.statLabel}>En attente</p>
                <p style={styles.statValue}>{dashboard.statistics.pending}</p>
              </div>
            </div>

            <div style={styles.statBox}>
              <div style={{ ...styles.statIcon, background: 'var(--bf-yellow)' }}>
                <Activity size={24} color="white" />
              </div>
              <div>
                <p style={styles.statLabel}>Total</p>
                <p style={styles.statValue}>{dashboard.statistics.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card" style={styles.filters}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <Filter size={16} />
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">Tous</option>
              <option value="SUCCESS">Réussis</option>
              <option value="FAILED">Échoués</option>
              <option value="PENDING">En attente</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <Calendar size={16} />
              Date début
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <Calendar size={16} />
              Date fin
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              style={styles.filterInput}
            />
          </div>

          <button
            className="btn btn-outline"
            onClick={() => {
              setStatusFilter('');
              setDateRange({
                startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
                endDate: format(new Date(), 'yyyy-MM-dd')
              });
            }}
          >
            Réinitialiser
          </button>
        </div>

        {/* Liste des transactions */}
        <div className="card">
          <h2 style={styles.sectionTitle}>
            Transactions récentes ({payments.length})
          </h2>

          {payments.length === 0 ? (
            <div style={styles.emptyState}>
              <Wallet size={48} color="var(--text-light)" />
              <p>Aucune transaction trouvée</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Méthode</th>
                    <th>Montant</th>
                    <th>Frais</th>
                    <th>Net</th>
                    <th>Statut</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        {format(
                          new Date(payment.createdAt),
                          'dd MMM yyyy HH:mm',
                          { locale: fr }
                        )}
                      </td>
                      <td>
                        <div style={styles.clientCell}>
                          <User size={16} />
                          <span>
                            {payment.client.firstName} {payment.client.lastName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={styles.methodCell}>
                          <CreditCard size={16} />
                          {payment.paymentMethod}
                        </div>
                      </td>
                      <td>
                        <span className="amount-fcfa">
                          {payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td style={styles.feesCell}>
                        -{payment.fees.toLocaleString()} FCFA
                      </td>
                      <td>
                        <strong style={{ color: 'var(--bf-green)' }}>
                          {payment.netAmount.toLocaleString()} FCFA
                        </strong>
                      </td>
                      <td>
                        <StatusBadge status={payment.status} />
                      </td>
                      <td style={styles.transactionId}>
                        {payment.transactionId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dernières transactions - Vue rapide */}
        <div className="card">
          <h2 style={styles.sectionTitle}>Activité récente</h2>
          <div style={styles.activityList}>
            {dashboard.recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction._id} style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  {transaction.status === 'SUCCESS' ? (
                    <CheckCircle size={20} color="var(--status-success)" />
                  ) : transaction.status === 'FAILED' ? (
                    <XCircle size={20} color="var(--status-error)" />
                  ) : (
                    <Clock size={20} color="var(--status-pending)" />
                  )}
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityTitle}>
                    Paiement de {transaction.client.firstName}{' '}
                    {transaction.client.lastName}
                  </p>
                  <p style={styles.activityDate}>
                    {format(new Date(transaction.createdAt), 'dd MMM yyyy à HH:mm', {
                      locale: fr
                    })}
                  </p>
                </div>
                <div style={styles.activityAmount}>
                  <span className="amount-fcfa">
                    {transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
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
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '24px',
    color: 'var(--text-primary)'
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'var(--bg-secondary)',
    borderRadius: '12px'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  filters: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: '200px'
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  filterSelect: {
    padding: '12px 16px',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  filterInput: {
    padding: '12px 16px',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)'
  },
  clientCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  methodCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  feesCell: {
    color: 'var(--status-error)',
    fontSize: '14px'
  },
  transactionId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderRadius: '12px',
    transition: 'all 0.2s ease'
  },
  activityIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  activityDate: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  activityAmount: {
    fontSize: '16px',
    fontWeight: '700'
  }
};

export default MerchantDashboard;