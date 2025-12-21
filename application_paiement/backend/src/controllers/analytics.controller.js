const Transaction = require('../models/Transaction.model');
const Merchant = require('../models/Merchant.model');

exports.getRevenue = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const merchantId = req.user.merchant._id;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const groupByFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      year: { $dateToString: { format: '%Y', date: '$createdAt' } }
    };

    const revenue = await Transaction.aggregate([
      {
        $match: {
          merchant: merchantId,
          status: 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupByFormat[groupBy],
          totalRevenue: { $sum: '$netAmount' },
          totalAmount: { $sum: '$amount' },
          totalCommission: { $sum: '$commission.totalFee' },
          transactionCount: { $sum: 1 },
          avgTransaction: { $avg: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totals = await Transaction.aggregate([
      {
        $match: {
          merchant: merchantId,
          status: 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$netAmount' },
          totalAmount: { $sum: '$amount' },
          totalCommission: { $sum: '$commission.totalFee' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: { startDate: start, endDate: end },
        summary: totals[0] || {
          totalRevenue: 0,
          totalAmount: 0,
          totalCommission: 0,
          transactionCount: 0
        },
        breakdown: revenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue data',
      error: error.message
    });
  }
};

exports.getProviderStats = async (req, res) => {
  try {
    const merchantId = req.user.merchant._id;

    const stats = await Transaction.aggregate([
      { $match: { merchant: merchantId, status: 'completed' } },
      {
        $group: {
          _id: '$provider',
          totalTransactions: { $sum: 1 },
          totalRevenue: { $sum: '$netAmount' },
          totalAmount: { $sum: '$amount' },
          totalCommission: { $sum: '$commission.totalFee' },
          avgTransactionAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const failureRates = await Transaction.aggregate([
      { $match: { merchant: merchantId } },
      {
        $group: {
          _id: '$provider',
          total: { $sum: 1 },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      },
      {
        $project: {
          provider: '$_id',
          failureRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$failed', '$total'] }, 100] }
            ]
          }
        }
      }
    ]);

    const enrichedStats = stats.map(stat => {
      const failureData = failureRates.find(f => f.provider === stat._id);
      return {
        ...stat,
        failureRate: failureData ? failureData.failureRate : 0
      };
    });

    res.status(200).json({
      success: true,
      data: {
        providers: enrichedStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching provider statistics',
      error: error.message
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const merchantId = req.user.merchant._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayStats, monthStats, recentTransactions, merchant] = await Promise.all([
      Transaction.aggregate([
        { $match: { merchant: merchantId, createdAt: { $gte: today } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$netAmount', 0] } },
            transactionCount: { $sum: 1 }
          }
        }
      ]),
      Transaction.aggregate([
        { $match: { merchant: merchantId, createdAt: { $gte: thisMonth } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$netAmount', 0] } },
            transactionCount: { $sum: 1 }
          }
        }
      ]),
      Transaction.find({ merchant: merchantId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('transactionId amount status provider createdAt'),
      Merchant.findById(merchantId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: todayStats[0] || { totalRevenue: 0, transactionCount: 0 },
        thisMonth: monthStats[0] || { totalRevenue: 0, transactionCount: 0 },
        lifetime: {
          totalRevenue: merchant.totalRevenue,
          totalTransactions: merchant.totalTransactions,
          balance: merchant.balance
        },
        recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const merchantId = req.user.merchant._id;

    const query = { merchant: merchantId };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .select('-__v -updatedAt')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvData = transactions.map(t => ({
        TransactionID: t.transactionId,
        Date: t.createdAt.toISOString(),
        Amount: t.amount,
        Currency: t.currency,
        Status: t.status,
        Provider: t.provider,
        CustomerEmail: t.customer.email,
        NetAmount: t.netAmount,
        Commission: t.commission.totalFee
      }));

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: {
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};
