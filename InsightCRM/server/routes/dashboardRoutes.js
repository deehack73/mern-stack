
const express = require('express');
const router = express.Router();

const {
  getDashboardSummary,
  getRevenueOverview,
  getPipelineOverview
} = require('../controllers/dashboardController');

router.get('/summary', getDashboardSummary);
router.get('/revenue', getRevenueOverview);
router.get('/pipeline', getPipelineOverview);

module.exports = router;
