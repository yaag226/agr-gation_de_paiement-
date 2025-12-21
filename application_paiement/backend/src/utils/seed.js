const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Merchant = require('../models/Merchant.model');
const Transaction = require('../models/Transaction.model');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearData = async () => {
  try {
    await User.deleteMany({});
    await Merchant.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@payment.com',
      password: 'Admin123!',
      role: 'admin',
      phone: '+33612345678',
      isActive: true
    });
    console.log('✅ Admin user created');

    const merchant1User = await User.create({
      name: 'Tech Store',
      email: 'merchant1@test.com',
      password: 'Merchant123!',
      role: 'merchant',
      phone: '+33612345679',
      isActive: true
    });

    const merchant1 = await Merchant.create({
      user: merchant1User._id,
      businessName: 'Tech Store SAS',
      businessType: 'company',
      description: 'Boutique en ligne de produits électroniques',
      website: 'https://techstore.example.com',
      address: {
        street: '123 Rue de la Tech',
        city: 'Paris',
        state: 'Île-de-France',
        country: 'France',
        postalCode: '75001'
      },
      isVerified: true,
      isActive: true,
      providers: [
        {
          provider: 'stripe',
          isActive: true,
          apiKey: 'pk_test_mock_key',
          secretKey: 'sk_test_mock_key',
          priority: 1
        },
        {
          provider: 'paypal',
          isActive: true,
          apiKey: 'paypal_mock_client_id',
          secretKey: 'paypal_mock_secret',
          priority: 2
        }
      ],
      settings: {
        currency: 'EUR',
        notificationEmail: 'merchant1@test.com',
        webhookUrl: 'https://techstore.example.com/webhook'
      }
    });

    merchant1User.merchant = merchant1._id;
    await merchant1User.save();
    console.log('✅ Merchant 1 created');

    const merchant2User = await User.create({
      name: 'Fashion Boutique',
      email: 'merchant2@test.com',
      password: 'Merchant123!',
      role: 'merchant',
      phone: '+33612345680',
      isActive: true
    });

    const merchant2 = await Merchant.create({
      user: merchant2User._id,
      businessName: 'Fashion Boutique Paris',
      businessType: 'individual',
      description: 'Vente de vêtements et accessoires de mode',
      website: 'https://fashionboutique.example.com',
      address: {
        street: '456 Avenue des Champs',
        city: 'Lyon',
        state: 'Auvergne-Rhône-Alpes',
        country: 'France',
        postalCode: '69001'
      },
      isVerified: true,
      isActive: true,
      providers: [
        {
          provider: 'stripe',
          isActive: true,
          apiKey: 'pk_test_mock_key',
          secretKey: 'sk_test_mock_key',
          priority: 1
        }
      ],
      settings: {
        currency: 'EUR',
        notificationEmail: 'merchant2@test.com'
      }
    });

    merchant2User.merchant = merchant2._id;
    await merchant2User.save();
    console.log('✅ Merchant 2 created');

    const merchant3User = await User.create({
      name: 'Eco Products',
      email: 'merchant3@test.com',
      password: 'Merchant123!',
      role: 'merchant',
      phone: '+33612345681',
      isActive: true
    });

    const merchant3 = await Merchant.create({
      user: merchant3User._id,
      businessName: 'Eco Products SARL',
      businessType: 'company',
      description: 'Produits écologiques et durables',
      website: 'https://ecoproducts.example.com',
      address: {
        street: '789 Rue Verte',
        city: 'Marseille',
        state: 'Provence-Alpes-Côte d\'Azur',
        country: 'France',
        postalCode: '13001'
      },
      isVerified: false,
      isActive: true,
      providers: [
        {
          provider: 'wave',
          isActive: true,
          apiKey: 'wave_mock_key',
          secretKey: 'wave_mock_secret',
          priority: 1
        }
      ],
      settings: {
        currency: 'EUR',
        notificationEmail: 'merchant3@test.com'
      }
    });

    merchant3User.merchant = merchant3._id;
    await merchant3User.save();
    console.log('✅ Merchant 3 created');

    const transactions = [];
    const statuses = ['completed', 'completed', 'completed', 'pending', 'failed'];
    const providers = ['stripe', 'paypal', 'stripe'];

    for (let i = 0; i < 15; i++) {
      const amount = Math.floor(Math.random() * 500) + 50;
      const providerFee = amount * 0.029;
      const platformFee = amount * 0.005;

      const daysAgo = Math.floor(Math.random() * 30);
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - daysAgo);

      const transaction = {
        merchant: merchant1._id,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        provider: providers[Math.floor(Math.random() * providers.length)],
        providerTransactionId: `PI_${Math.random().toString(36).substr(2, 16)}`,
        amount: amount,
        currency: 'EUR',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        customer: {
          email: `customer${i}@test.com`,
          name: `Customer ${i}`
        },
        description: `Test transaction ${i + 1}`,
        commission: {
          providerFee,
          platformFee,
          totalFee: providerFee + platformFee
        },
        netAmount: amount - (providerFee + platformFee),
        paymentMethod: 'card',
        createdAt: transactionDate,
        updatedAt: transactionDate
      };

      if (transaction.status === 'completed') {
        transaction.completedAt = transactionDate;
      }

      transactions.push(transaction);
    }

    for (let i = 0; i < 8; i++) {
      const amount = Math.floor(Math.random() * 300) + 30;
      const providerFee = amount * 0.029;
      const platformFee = amount * 0.005;

      const daysAgo = Math.floor(Math.random() * 30);
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - daysAgo);

      transactions.push({
        merchant: merchant2._id,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        provider: 'stripe',
        providerTransactionId: `PI_${Math.random().toString(36).substr(2, 16)}`,
        amount: amount,
        currency: 'EUR',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        customer: {
          email: `buyer${i}@test.com`,
          name: `Buyer ${i}`
        },
        description: `Fashion purchase ${i + 1}`,
        commission: {
          providerFee,
          platformFee,
          totalFee: providerFee + platformFee
        },
        netAmount: amount - (providerFee + platformFee),
        paymentMethod: 'card',
        createdAt: transactionDate,
        updatedAt: transactionDate,
        completedAt: transactionDate
      });
    }

    await Transaction.insertMany(transactions);
    console.log('✅ Test transactions created');

    const completedTransactions1 = transactions.filter(
      t => t.merchant.equals(merchant1._id) && t.status === 'completed'
    );
    merchant1.totalTransactions = completedTransactions1.length;
    merchant1.totalRevenue = completedTransactions1.reduce((sum, t) => sum + t.netAmount, 0);
    await merchant1.save();

    const completedTransactions2 = transactions.filter(
      t => t.merchant.equals(merchant2._id) && t.status === 'completed'
    );
    merchant2.totalTransactions = completedTransactions2.length;
    merchant2.totalRevenue = completedTransactions2.reduce((sum, t) => sum + t.netAmount, 0);
    await merchant2.save();

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   - 1 Admin user');
    console.log('   - 3 Merchant users');
    console.log('   - 23 Test transactions');
    console.log('\n🔑 Test Credentials:');
    console.log('\n   Admin:');
    console.log('   Email: admin@payment.com');
    console.log('   Password: Admin123!');
    console.log('\n   Merchant 1 (Tech Store):');
    console.log('   Email: merchant1@test.com');
    console.log('   Password: Merchant123!');
    console.log('\n   Merchant 2 (Fashion):');
    console.log('   Email: merchant2@test.com');
    console.log('   Password: Merchant123!');
    console.log('\n   Merchant 3 (Eco Products):');
    console.log('   Email: merchant3@test.com');
    console.log('   Password: Merchant123!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

const run = async () => {
  await connectDB();
  await clearData();
  await seedData();
  mongoose.connection.close();
  console.log('\n👋 Database connection closed');
  process.exit(0);
};

run();
