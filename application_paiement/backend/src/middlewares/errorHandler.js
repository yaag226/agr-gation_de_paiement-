const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors
    });
  }

  // Erreur de duplication (email existant)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cet email est déjà utilisé'
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;