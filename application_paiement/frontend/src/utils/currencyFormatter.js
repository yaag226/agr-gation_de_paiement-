/**
 * Utilitaire de formatage de devise pour le Burkina Faso (FCFA)
 */

/**
 * Formate un montant en FCFA
 * @param {number} amount - Le montant à formater
 * @param {boolean} showSymbol - Afficher le symbole de la devise (par défaut: true)
 * @returns {string} Le montant formaté
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0 FCFA' : '0';
  }

  // Formater le nombre avec des espaces comme séparateurs de milliers
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `${formattedAmount} FCFA` : formattedAmount;
};

/**
 * Formate un montant en FCFA avec décimales
 * @param {number} amount - Le montant à formater
 * @param {boolean} showSymbol - Afficher le symbole de la devise (par défaut: true)
 * @returns {string} Le montant formaté
 */
export const formatCurrencyWithDecimals = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0,00 FCFA' : '0,00';
  }

  // Formater le nombre avec des décimales
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `${formattedAmount} FCFA` : formattedAmount;
};

/**
 * Formate un montant court pour les affichages compacts (ex: 1M FCFA, 500K FCFA)
 * @param {number} amount - Le montant à formater
 * @returns {string} Le montant formaté de manière compacte
 */
export const formatCompactCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 FCFA';
  }

  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}Md FCFA`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M FCFA`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K FCFA`;
  }

  return `${amount} FCFA`;
};

/**
 * Symbole de la devise
 */
export const CURRENCY_SYMBOL = 'FCFA';

/**
 * Code de la devise (ISO 4217)
 */
export const CURRENCY_CODE = 'XOF';
