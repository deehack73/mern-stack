
const Activity = require('../models/Activity');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET all activities
const getActivities = async (req, res) => {
  try {
    const { search, status, activityType } = req.query;
    const filter = {};

    if (search) {
      const safeSearch = String(search).replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (activityType) filter.activityType = activityType;

    const activities = await Activity.find(filter)
      .populate('customer', 'fullName email company')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET single activity
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('customer', 'fullName email company');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });

  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};


// POST create activity
const createActivity = async (req, res) => {
  try {
    const {
      title,
      customer,
      activityType,
      description,
      date,
      status
    } = req.body;

    if (!title || !customer || !activityType || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, customer, activity type and date'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        success: false,
        message: 'Referenced customer does not exist'
      });
    }

    const activity = await Activity.create({
      title,
      customer,
      activityType,
      description,
      date,
      status
    });

    const populatedActivity = await Activity.findById(
      activity._id
    ).populate('customer', 'fullName email company');

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: populatedActivity
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// PUT update activity
const updateActivity = async (req, res) => {
  try {
    const allowedFields = [
      'title',
      'customer',
      'activityType',
      'description',
      'date',
      'status'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    if (updates.customer) {
      if (!mongoose.Types.ObjectId.isValid(updates.customer)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customer ID'
        });
      }

      const customerExists = await Customer.findById(
        updates.customer
      );

      if (!customerExists) {
        return res.status(404).json({
          success: false,
          message: 'Referenced customer does not exist'
        });
      }
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate('customer', 'fullName email company');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });

  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 400).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE activity
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(
      req.params.id
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });

  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
