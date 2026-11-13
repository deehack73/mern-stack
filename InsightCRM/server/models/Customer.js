
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      trim: true
    },

    fullName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    industry: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Prospect'],
      default: 'Prospect'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', customerSchema);
