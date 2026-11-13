
const Customer = require('../models/Customer');
const { randomUUID } = require('crypto');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
const getCustomers = async (req, res) => {
  try {
    const { search, status } = req.query;

    let filter = {};

    // Search customers by name, email or company
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by customer status
    if (status) {
      filter.status = status;
    }

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get a single customer
// @route   GET /api/customers/:id
// @access  Public
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    const statusCode = error.name === 'CastError' ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.name === 'CastError'
        ? 'Invalid customer ID'
        : error.message
    });
  }
};


// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public
const createCustomer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      company,
      industry,
      location,
      status
    } = req.body;

    if (!fullName || !email || !phone || !company) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone and company'
      });
    }

    const existingCustomer = await Customer.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: 'A customer with this email already exists'
      });
    }

    const customer = await Customer.create({
      customerId: `CUS-${randomUUID().slice(0, 8).toUpperCase()}`,
      fullName,
      email,
      phone,
      company,
      industry,
      location,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });

  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.code === 11000
        ? 'Customer email or ID already exists'
        : error.message
    });
  }
};


// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Public
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });

  } catch (error) {
    const statusCode =
      error.name === 'CastError' ? 400 :
      error.code === 11000 ? 409 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    const statusCode =
      error.name === 'CastError' ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};


// Export all controller functions
module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
