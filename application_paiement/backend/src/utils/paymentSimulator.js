/**
 * Simulateur de paiement pour projet académique
 * Simule les paiements mobiles au Burkina Faso
 */

const simulatePayment = async (paymentData) => {
  return new Promise((resolve) => {
    // Temps de traitement réaliste (2-5 secondes)
    const processingTime = Math.floor(Math.random() * 3000) + 2000;
    
    setTimeout(() => {
      // 90% de succès, 10% d'échec (réaliste pour le Burkina)
      const isSuccess = Math.random() > 0.10;
      
      const result = {
        success: isSuccess,
        processingTime,
        processedAt: new Date()
      };

      if (!isSuccess) {
        const failureReasons = [
          'Solde insuffisant',
          'Code PIN incorrect',
          'Transaction expirée (timeout)',
          'Service temporairement indisponible',
          'Limite journalière atteinte',
          'Numéro invalide ou inactif'
        ];
        result.failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      } else {
        result.message = 'Paiement effectué avec succès';
      }

      resolve(result);
    }, processingTime);
  });
};

/**
 * Valider le numéro de téléphone burkinabè
 */
const validateBurkinabePhone = (phone) => {
  // Format: +226 XX XX XX XX ou 226XXXXXXXX ou XXXXXXXX
  const patterns = [
    /^\+226[567]\d{7}$/,
    /^226[567]\d{7}$/,
    /^[567]\d{7}$/
  ];
  
  return patterns.some(pattern => pattern.test(phone.replace(/\s/g, '')));
};

/**
 * Formater le montant en FCFA
 */
const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-BF', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA');
};

module.exports = { 
  simulatePayment,
  validateBurkinabePhone,
  formatAmount
};