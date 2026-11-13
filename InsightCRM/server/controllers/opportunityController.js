
const Opportunity = require('../models/Opportunity');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET all opportunities
const getOpportunities = async (req, res) => {
  try {
    const { search, stage } = req.query;
    const filter = {};

    if (search) {
      const safeSearch = String(search).replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      filter.$or = [
        { opportunityName: { $regex: safeSearch, $options: 'i' } },
        { company: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    if (stage) {
      filter.stage = stage;
    }

    const opportunities = await Opportunity.find(filter)
      .populate('customer', 'fullName email company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET a single opportunity
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('customer', 'fullName email company');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity
    });

  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.name === 'CastError'
        ? 'Invalid opportunity ID'
        : error.message
    });
  }
};


// POST create a new opportunity
const createOpportunity = async (req, res) => {
  try {
    const {
      opportunityName,
      customer,
      company,
      dealValue,
      stage,
      expectedClosingDate,
      description
    } = req.body;

    if (
      !opportunityName ||
      !customer ||
      !company ||
      dealValue === undefined ||
      !expectedClosingDate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide opportunity name, customer, company, deal value and closing date'
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

    const opportunity = await Opportunity.create({
      opportunityName,
      customer,
      company,
      dealValue,
      stage,
      expectedClosingDate,
      description
    });

    const populatedOpportunity = await Opportunity.findById(
      opportunity._id
    ).populate('customer', 'fullName email company');

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: populatedOpportunity
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// PUT update an opportunity
const updateOpportunity = async (req, res) => {
  try {
    const allowedFields = [
      'opportunityName',
      'customer',
      'company',
      'dealValue',
      'stage',
      'expectedClosingDate',
      'description'
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

    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate('customer', 'fullName email company');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully',
      data: opportunity
    });

  } catch (error) {
    const statusCode =
      error.name === 'CastError' ? 400 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE an opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(
      req.params.id
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully'
    });

  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};


// GET total deal value grouped by sales stage
const getPipelineSummary = async (req, res) => {
  try {
    const summary = await Opportunity.aggregate([
      {
        $group: {
          _id: '$stage',
          totalDeals: { $sum: 1 },
          totalValue: { $sum: '$dealValue' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getPipelineSummary
};
