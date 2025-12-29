require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkMerchants = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    // Compter tous les utilisateurs
    const totalUsers = await User.countDocuments();
    console.log('👥 Total d\'utilisateurs:', totalUsers);

    // Compter par rôle
    const adminCount = await User.countDocuments({ role: 'admin' });
    const merchantCount = await User.countDocuments({ role: 'merchant' });
    const clientCount = await User.countDocuments({ role: 'client' });

    console.log('   - Admins:', adminCount);
    console.log('   - Marchands:', merchantCount);
    console.log('   - Clients:', clientCount);

    // Marchands actifs vs inactifs
    const activeMerchants = await User.countDocuments({ role: 'merchant', isActive: true });
    const inactiveMerchants = await User.countDocuments({ role: 'merchant', isActive: false });

    console.log('\n🏪 Marchands:');
    console.log('   - Actifs:', activeMerchants);
    console.log('   - Inactifs:', inactiveMerchants);

    // Afficher les détails des marchands
    if (merchantCount > 0) {
      console.log('\n📋 Liste des marchands:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const merchants = await User.find({ role: 'merchant' })
        .select('businessName email phone businessCategory isActive');

      merchants.forEach((merchant, index) => {
        const status = merchant.isActive ? '✅ ACTIF' : '❌ INACTIF';
        console.log(`\n${index + 1}. ${merchant.businessName} ${status}`);
        console.log(`   Email: ${merchant.email}`);
        console.log(`   Téléphone: ${merchant.phone}`);
        console.log(`   Catégorie: ${merchant.businessCategory || 'Non définie'}`);
      });
    } else {
      console.log('\n⚠️  AUCUN MARCHAND TROUVÉ DANS LA BASE DE DONNÉES');
      console.log('\n💡 Solutions:');
      console.log('   1. Exécutez: npm run seed');
      console.log('   2. Ou créez un marchand via l\'interface d\'inscription');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

checkMerchants();
