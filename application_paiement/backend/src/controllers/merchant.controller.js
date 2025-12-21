const Merchant = require('../models/Merchant.model');
const Transaction = require('../models/Transaction.model');

exports.getAllMerchants = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isVerified, isActive } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const merchants = await Merchant.find(query)
      .populate('user', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Merchant.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: {
        merchants
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching merchants',
      error: error.message
    });
  }
};

exports.getMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate('user', 'name email phone');

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        merchant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching merchant',
      error: error.message
    });
  }
};

exports.updateMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        merchant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating merchant',
      error: error.message
    });
  }
};

exports.addProviderConfig = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.merchant._id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    const existingProvider = merchant.providers.find(
      p => p.provider === req.body.provider
    );

    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'Provider already configured. Use update endpoint to modify.'
      });
    }

    merchant.providers.push(req.body);
    await merchant.save();

    res.status(200).json({
      success: true,
      message: 'Provider configuration added successfully',
      data: {
        merchant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding provider configuration',
      error: error.message
    });
  }
};

exports.updateProviderConfig = async (req, res) => {
  try {
    const { provider } = req.params;
    const merchant = await Merchant.findById(req.user.merchant._id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    const providerIndex = merchant.providers.findIndex(p => p.provider === provider);

    if (providerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Provider configuration not found'
      });
    }

    Object.assign(merchant.providers[providerIndex], req.body);
    await merchant.save();

    res.status(200).json({
      success: true,
      message: 'Provider configuration updated successfully',
      data: {
        merchant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating provider configuration',
      error: error.message
    });
  }
};

exports.removeProviderConfig = async (req, res) => {
  try {
    const { provider } = req.params;
    const merchant = await Merchant.findById(req.user.merchant._id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    merchant.providers = merchant.providers.filter(p => p.provider !== provider);
    await merchant.save();

    res.status(200).json({
      success: true,
      message: 'Provider configuration removed successfully',
      data: {
        merchant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing provider configuration',
      error: error.message
    });
  }
};

exports.getMerchantStats = async (req, res) => {
  try {
    const merchantId = req.user.merchant._id;

    const stats = await Transaction.aggregate([
      { $match: { merchant: merchantId } },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          completedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$netAmount', 0] }
          },
          totalCommission: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$commission.totalFee', 0] }
          }
        }
      }
    ]);

    const providerStats = await Transaction.aggregate([
      { $match: { merchant: merchantId, status: 'completed' } },
      {
        $group: {
          _id: '$provider',
          count: { $sum: 1 },
          revenue: { $sum: '$netAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalTransactions: 0,
          completedTransactions: 0,
          failedTransactions: 0,
          totalRevenue: 0,
          totalCommission: 0
        },
        byProvider: providerStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching merchant statistics',
      error: error.message
    });
  }
};
