
const express = require('express');
const router = express.Router();

const {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

router.get('/', getActivities);
router.post('/', createActivity);
router.get('/:id', getActivityById);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
