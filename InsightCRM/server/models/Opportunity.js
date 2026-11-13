
const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    opportunityName: {
      type: String,
      required: [true, 'Opportunity name is required'],
      trim: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required']
    },

    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },

    dealValue: {
      type: Number,
      required: [true, 'Deal value is required'],
      min: 0
    },

    stage: {
      type: String,
      enum: [
        'New',
        'Qualification',
        'Proposal',
        'Negotiation',
        'Won',
        'Lost'
      ],
      default: 'New'
    },

    expectedClosingDate: {
      type: Date,
      required: [true, 'Expected closing date is required']
    },

    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Opportunity',
  opportunitySchema
);
