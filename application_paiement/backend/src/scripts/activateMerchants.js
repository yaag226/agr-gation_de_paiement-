const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

const User = require('../models/User');

const activateMerchants = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer tous les utilisateurs avec le rôle merchant
    const allMerchants = await User.find({ role: 'merchant' });

    console.log('\n📊 ÉTAT ACTUEL DES MARCHANDS:');
    console.log('================================');
    console.log(`Total de marchands: ${allMerchants.length}`);

    if (allMerchants.length === 0) {
      console.log('❌ Aucun marchand trouvé dans la base de données.');
      console.log('\nVeuillez créer un marchand via l\'interface d\'inscription avec le rôle "merchant".');
      process.exit(0);
    }

    allMerchants.forEach((merchant, index) => {
      console.log(`\n${index + 1}. ${merchant.businessName || '(Nom non défini)'}`);
      console.log(`   - Email: ${merchant.email}`);
      console.log(`   - Rôle: ${merchant.role}`);
      console.log(`   - Actif: ${merchant.isActive ? '✅ Oui' : '❌ Non'}`);
      console.log(`   - Catégorie: ${merchant.businessCategory || '(Non définie)'}`);
      console.log(`   - Téléphone: ${merchant.phone}`);
      console.log(`   - ID: ${merchant._id}`);
    });

    // Compter les marchands inactifs
    const inactiveMerchants = allMerchants.filter(m => !m.isActive);

    if (inactiveMerchants.length > 0) {
      console.log('\n\n⚠️  MARCHANDS INACTIFS DÉTECTÉS:');
      console.log('=================================');
      console.log(`${inactiveMerchants.length} marchand(s) inactif(s) trouvé(s).`);

      // Activer tous les marchands inactifs
      const result = await User.updateMany(
        { role: 'merchant', isActive: false },
        { $set: { isActive: true } }
      );

      console.log(`\n✅ ${result.modifiedCount} marchand(s) activé(s) avec succès!`);
    } else {
      console.log('\n\n✅ Tous les marchands sont déjà actifs!');
    }

    // Vérifier les marchands sans businessName
    const merchantsWithoutName = allMerchants.filter(m => !m.businessName);
    if (merchantsWithoutName.length > 0) {
      console.log('\n\n⚠️  ATTENTION - MARCHANDS SANS NOM D\'ENTREPRISE:');
      console.log('================================================');
      merchantsWithoutName.forEach(merchant => {
        console.log(`- ${merchant.email} (ID: ${merchant._id})`);
      });
      console.log('\nCes marchands ne pourront pas être affichés correctement dans le dropdown.');
      console.log('Veuillez mettre à jour leurs informations.');
    }

    console.log('\n\n📋 RÉSUMÉ FINAL:');
    console.log('================');
    const finalActiveMerchants = await User.countDocuments({
      role: 'merchant',
      isActive: true
    });
    console.log(`✅ Marchands actifs: ${finalActiveMerchants}`);
    console.log(`❌ Marchands inactifs: ${allMerchants.length - finalActiveMerchants}`);
    console.log(`📝 Total: ${allMerchants.length}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Déconnecté de MongoDB');
    process.exit(0);
  }
};

activateMerchants();
