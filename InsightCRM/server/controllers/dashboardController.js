
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');
const Activity = require('../models/Activity');

const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalLeads,
      openOpportunities,
      pipelineResult,
      wonRevenueResult,
      pendingActivities
    ] = await Promise.all([
      Customer.countDocuments(),
      Lead.countDocuments(),
      Opportunity.countDocuments({
        stage: { $nin: ['Won', 'Lost'] }
      }),
      Opportunity.aggregate([
        { $match: { stage: { $nin: ['Won', 'Lost'] } } },
        {
          $group: {
            _id: null,
            total: { $sum: '$dealValue' }
          }
        }
      ]),
      Opportunity.aggregate([
        { $match: { stage: 'Won' } },
        {
          $group: {
            _id: null,
            total: { $sum: '$dealValue' }
          }
        }
      ]),
      Activity.countDocuments({ status: 'Pending' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalLeads,
        openOpportunities,
        pipelineValue: pipelineResult[0]?.total || 0,
        wonRevenue: wonRevenueResult[0]?.total || 0,
        pendingActivities
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary'
    });
  }
};

// Monthly won deal value for the last six months.
// updatedAt is used as an approximate won date.
const getRevenueOverview = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)
    );

    const results = await Opportunity.aggregate([
      {
        $match: {
          stage: 'Won',
          updatedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' }
          },
          revenue: { $sum: '$dealValue' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
      );

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;

      const result = results.find(
        item => item._id.year === year && item._id.month === month
      );

      months.push({
        month: date.toLocaleString('en-US', {
          month: 'short',
          timeZone: 'UTC'
        }),
        revenue: result?.revenue || 0
      });
    }

    res.status(200).json({
      success: true,
      data: months
    });
  } catch (error) {
    console.error('Revenue overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue overview'
    });
  }
};

// Opportunity count and deal value grouped by sales stage.
const getPipelineOverview = async (req, res) => {
  try {
    const results = await Opportunity.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$dealValue' }
        }
      }
    ]);

    const stages = [
      'New',
      'Qualification',
      'Proposal',
      'Negotiation',
      'Won',
      'Lost'
    ];

    const data = stages.map(stage => {
      const result = results.find(item => item._id === stage);

      return {
        stage,
        count: result?.count || 0,
        totalValue: result?.totalValue || 0
      };
    });

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Pipeline overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pipeline overview'
    });
  }
};

module.exports = {
  getDashboardSummary,
  getRevenueOverview,
  getPipelineOverview
};
