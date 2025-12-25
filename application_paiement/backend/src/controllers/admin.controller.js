const User = require('../models/User.model');
const Merchant = require('../models/Merchant.model');
const Transaction = require('../models/Transaction.model');

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

/**
 * Get user by ID (Admin only)
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

/**
 * Update user (Admin only)
 */
exports.updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user'
    });
  }
};

/**
 * Delete user (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
};

/**
 * Get admin dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMerchants,
      totalTransactions,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      Merchant.countDocuments(),
      Transaction.countDocuments(),
      User.countDocuments({ isActive: true })
    ]);

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const transactionStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalMerchants,
        totalTransactions,
        activeUsers,
        usersByRole,
        transactionStats
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

/**
 * Get all merchants (Admin only)
 */
exports.getAllMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: merchants
    });
  } catch (error) {
    console.error('Get all merchants error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch merchants'
    });
  }
};

/**
 * Get merchant by ID (Admin only)
 */
exports.getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!merchant) {
      return res.status(404).json({
        status: 'error',
        message: 'Merchant not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: merchant
    });
  } catch (error) {
    console.error('Get merchant by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch merchant'
    });
  }
};

/**
 * Verify merchant (Admin only)
 */
exports.verifyMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate('user', 'name email');

    if (!merchant) {
      return res.status(404).json({
        status: 'error',
        message: 'Merchant not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Merchant verified successfully',
      data: merchant
    });
  } catch (error) {
    console.error('Verify merchant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify merchant'
    });
  }
};

/**
 * Toggle merchant active status (Admin only)
 */
exports.toggleMerchantStatus = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);

    if (!merchant) {
      return res.status(404).json({
        status: 'error',
        message: 'Merchant not found'
      });
    }

    merchant.isActive = !merchant.isActive;
    await merchant.save();

    res.status(200).json({
      status: 'success',
      message: `Merchant ${merchant.isActive ? 'activated' : 'deactivated'} successfully`,
      data: merchant
    });
  } catch (error) {
    console.error('Toggle merchant status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update merchant status'
    });
  }
};

/**
 * Update merchant (Admin only)
 */
exports.updateMerchant = async (req, res) => {
  try {
    const { isActive, isVerified, businessName, description } = req.body;

    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { isActive, isVerified, businessName, description },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!merchant) {
      return res.status(404).json({
        status: 'error',
        message: 'Merchant not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Merchant updated successfully',
      data: merchant
    });
  } catch (error) {
    console.error('Update merchant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update merchant'
    });
  }
};
