require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Payment = require('./models/Payment');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connecté');
};

const seedData = async () => {
  try {
    await connectDB();

    // Nettoyer la base
    await User.deleteMany();
    await Payment.deleteMany();
    console.log('🗑️  Base de données nettoyée');

    // Créer un admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@payment-bf.com',
      password: 'admin123',
      role: 'admin',
      phone: '+22670000000'
    });

    // Créer des marchands
    const merchants = await User.insertMany([
      {
        firstName: 'Amadou',
        lastName: 'Ouédraogo',
        email: 'amadou@boutique.bf',
        password: 'merchant123',
        role: 'merchant',
        phone: '+22670123456',
        businessName: 'Boutique Wend Panga',
        businessCategory: 'Boutique',
        businessAddress: 'Ouagadougou, Burkina Faso'
      },
      {
        firstName: 'Fatimata',
        lastName: 'Kaboré',
        email: 'fatimata@restaurant.bf',
        password: 'merchant123',
        role: 'merchant',
        phone: '+22670234567',
        businessName: 'Restaurant Chez Fatim',
        businessCategory: 'Restaurant',
        businessAddress: 'Bobo-Dioulasso, Burkina Faso'
      },
      {
        firstName: 'Ibrahim',
        lastName: 'Sawadogo',
        email: 'ibrahim@tech.bf',
        password: 'merchant123',
        role: 'merchant',
        phone: '+22670345678',
        businessName: 'BF Tech Store',
        businessCategory: 'Electronique',
        businessAddress: 'Ouagadougou, Burkina Faso'
      }
    ]);

    // Créer des clients
    const clients = await User.insertMany([
      {
        firstName: 'Salif',
        lastName: 'Traoré',
        email: 'salif@email.com',
        password: 'client123',
        role: 'client',
        phone: '+22670456789'
      },
      {
        firstName: 'Awa',
        lastName: 'Compaoré',
        email: 'awa@email.com',
        password: 'client123',
        role: 'client',
        phone: '+22670567890'
      }
    ]);

    console.log('✅ Utilisateurs créés:');
    console.log(`   - 1 Admin: ${admin.email} / admin123`);
    console.log(`   - ${merchants.length} Marchands`);
    console.log(`   - ${clients.length} Clients`);

    console.log('\n📊 Comptes de test:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN:');
    console.log(`  Email: admin@payment-bf.com`);
    console.log(`  Password: admin123`);
    console.log('\nMARCHANDS:');
    merchants.forEach(m => {
      console.log(`  ${m.businessName}: ${m.email} / merchant123`);
    });
    console.log('\nCLIENTS:');
    clients.forEach(c => {
      console.log(`  ${c.firstName} ${c.lastName}: ${c.email} / client123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedData();