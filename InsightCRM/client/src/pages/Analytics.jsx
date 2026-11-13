
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../services/api';

const COLORS = ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

export default function Analytics() {
  const [summary, setSummary] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const [summaryRes, revenueRes, pipelineRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/revenue'),
          api.get('/dashboard/pipeline')
        ]);

        setSummary(summaryRes.data.data || {});
        setRevenue(revenueRes.data.data || []);
        setPipeline(pipelineRes.data.data || []);
      } catch (err) {
        setError('Unable to load analytics. Please check that the backend is running.');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);

  const pipelineData = pipeline.filter(item => item.count > 0);

  if (loading) {
    return <div className="page-content">Loading analytics...</div>;
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Analytics</h1>
          <p>Understand your business performance and sales pipeline.</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Customers</span>
          <h2>{summary.totalCustomers || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Total Leads</span>
          <h2>{summary.totalLeads || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Open Opportunities</span>
          <h2>{summary.openOpportunities || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Pipeline Value</span>
          <h2>{formatCurrency(summary.pipelineValue)}</h2>
        </div>

        <div className="stat-card">
          <span>Won Revenue</span>
          <h2>{formatCurrency(summary.wonRevenue)}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Activities</span>
          <h2>{summary.pendingActivities || 0}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Revenue Overview</h2>
            <span>Last 6 months</span>
          </div>

          <div className="chart-container">
            {revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="chart-empty-message">No revenue data available.</p>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Opportunity Distribution</h2>
            <span>By sales stage</span>
          </div>

          <div className="chart-container">
            {pipelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pipelineData}
                    dataKey="count"
                    nameKey="stage"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell
                        key={entry.stage}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="chart-empty-message">
                No opportunities available. Add opportunities to see the distribution.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <h2>Sales Pipeline Details</h2>
        </div>

        <div className="customer-table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Opportunities</th>
                <th>Total Deal Value</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map(item => (
                <tr key={item.stage}>
                  <td>{item.stage}</td>
                  <td>{item.count}</td>
                  <td>{formatCurrency(item.totalValue)}</td>
                </tr>
              ))}
              {pipeline.length === 0 && (
                <tr>
                  <td colSpan="3">No pipeline data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
