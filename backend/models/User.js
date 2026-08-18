const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,     // allows multiple users without phoneNumber
      trim: true,
      default: null
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ['farmer', 'admin', 'agronomist'],
      default: 'farmer'
    },

    location: {
      village: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: '' }
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    lastLogin: {
      type: Date,
      default: null
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true // replaces createdAt & updatedAt (cleaner)
  }
);

// 🔐 Hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔁 Reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// ✅ Indexes (NO DUPLICATES)
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);
