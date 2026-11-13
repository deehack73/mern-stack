
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadName: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
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
      required: [true, 'Company name is required'],
      trim: true
    },

    source: {
      type: String,
      enum: [
        'Website',
        'Social Media',
        'Referral',
        'Advertisement',
        'Direct Contact'
      ],
      required: true
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Qualified',
        'Converted',
        'Lost'
      ],
      default: 'New'
    },

    expectedDealValue: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lead', leadSchema);
