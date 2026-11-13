
const Lead = require('../models/Lead');

// GET all leads
const getLeads = async (req, res) => {
  try {
    const { search, status, priority } = req.query;
    const filter = {};

    if (search) {
      const safeSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { leadName: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { company: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET single lead
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// POST create lead
const createLead = async (req, res) => {
  try {
    const {
      leadName, email, phone, company,
      source, priority, status, expectedDealValue
    } = req.body;

    const lead = await Lead.create({
      leadName, email, phone, company,
      source, priority, status, expectedDealValue
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// PUT update lead
const updateLead = async (req, res) => {
  try {
    const allowedFields = [
      'leadName', 'email', 'phone', 'company',
      'source', 'priority', 'status', 'expectedDealValue'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
};
