
const express = require('express');

const router = express.Router();

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

// GET all customers
router.get('/', getCustomers);

// POST create customer
router.post('/', createCustomer);

// GET single customer
router.get('/:id', getCustomerById);

// PUT update customer
router.put('/:id', updateCustomer);

// DELETE customer
router.delete('/:id', deleteCustomer);

module.exports = router;
