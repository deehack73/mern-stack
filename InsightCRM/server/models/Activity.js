
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required']
    },

    activityType: {
      type: String,
      enum: [
        'Phone Call',
        'Email',
        'Meeting',
        'Follow-up',
        'Other'
      ],
      required: [true, 'Activity type is required']
    },

    description: {
      type: String,
      trim: true
    },

    date: {
      type: Date,
      required: [true, 'Activity date is required']
    },

    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Activity', activitySchema);
