import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', provider: '' });

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      const response = await transactionAPI.getAll(filter);
      setTransactions(response.data.data.transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
      </div>

      <div className="card">
        <div className="mb-4 flex gap-4">
          <select
            className="input"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
          </select>

          <select
            className="input"
            value={filter.provider}
            onChange={(e) => setFilter({ ...filter, provider: e.target.value })}
          >
            <option value="">Tous les providers</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="wave">Wave</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Transaction</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono">{transaction.transactionId}</td>
                    <td className="px-4 py-3 text-sm">{transaction.customer.email}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{transaction.amount.toFixed(2)} {transaction.currency}</td>
                    <td className="px-4 py-3 text-sm capitalize">{transaction.provider}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`badge ${
                        transaction.status === 'completed' ? 'badge-success' :
                        transaction.status === 'pending' ? 'badge-warning' :
                        transaction.status === 'processing' ? 'badge-info' :
                        'badge-danger'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
