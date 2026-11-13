
const express = require('express');

const router = express.Router();

const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getPipelineSummary
} = require('../controllers/opportunityController');

// IMPORTANT: Keep summary before /:id
router.get('/summary', getPipelineSummary);

// GET all opportunities
router.get('/', getOpportunities);

// POST create opportunity
router.post('/', createOpportunity);

// GET single opportunity
router.get('/:id', getOpportunityById);

// PUT update opportunity
router.put('/:id', updateOpportunity);

// DELETE opportunity
router.delete('/:id', deleteOpportunity);

module.exports = router;
