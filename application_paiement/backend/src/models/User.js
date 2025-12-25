const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'merchant', 'admin'],
    default: 'client'
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est requis']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Spécifique aux marchands
  businessName: {
    type: String,
    required: function() { return this.role === 'merchant'; }
  },
  businessAddress: {
    type: String
  },
  businessCategory: {
    type: String,
    enum: ['Restaurant', 'Boutique', 'Services', 'Electronique', 'Mode', 'Autre']
  },
  // Statistiques
  totalReceived: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  transactionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir le nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);