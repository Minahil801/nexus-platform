const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['entrepreneur', 'investor'],
    required: true
  },
  profile: {
    bio: String,
    company: String,
    industry: String,
    investmentHistory: [String],
    startupHistory: [String],
    preferences: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(next);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);