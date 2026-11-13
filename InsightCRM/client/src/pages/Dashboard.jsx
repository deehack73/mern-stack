
import { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  BriefcaseBusiness,
  IndianRupee,
  CalendarCheck,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

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
  Cell
} from 'recharts';

import api from '../services/api';

const COLORS = [
  '#2563eb',
  '#8b5cf6',
  '#f59e0b',
  '#06b6d4',
  '#16a34a',
  '#ef4444'
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [summaryRes, revenueRes, pipelineRes] =
        await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/revenue'),
          api.get('/dashboard/pipeline')
        ]);

      setSummary(summaryRes.data.data);
      setRevenue(revenueRes.data.data);
      setPipeline(pipelineRes.data.data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Unable to load dashboard data. Check your backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: 'Total Customers',
      value: summary?.totalCustomers ?? 0,
      subtitle: 'Registered customers',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Leads',
      value: summary?.totalLeads ?? 0,
      subtitle: 'Potential customers',
      icon: UserPlus,
      color: 'purple'
    },
    {
      title: 'Open Opportunities',
      value: summary?.openOpportunities ?? 0,
      subtitle: 'Active sales deals',
      icon: BriefcaseBusiness,
      color: 'orange'
    },
    {
      title: 'Pipeline Value',
      value: `₹${(summary?.pipelineValue ?? 0).toLocaleString('en-IN')}`,
      subtitle: 'Total open deal value',
      icon: IndianRupee,
      color: 'green'
    }
  ];

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`;

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Monitor your business performance and activities.</p>
        </div>

        <button
          className="primary-button"
          onClick={fetchDashboard}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh Data
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={22} />
              </div>

              <p className="stat-title">{stat.title}</p>
              <h2>{loading ? '...' : stat.value}</h2>
              <span className="stat-change">{stat.subtitle}</span>
            </div>
          );
        })}
      </div>

      <div className="stats-grid secondary-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={22} />
          </div>
          <p className="stat-title">Won Revenue</p>
          <h2>
            {loading
              ? '...'
              : formatCurrency(summary?.wonRevenue)}
          </h2>
          <span className="stat-change">Revenue from won deals</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <CalendarCheck size={22} />
          </div>
          <p className="stat-title">Pending Activities</p>
          <h2>{loading ? '...' : summary?.pendingActivities ?? 0}</h2>
          <span className="stat-change">Activities awaiting completion</span>
        </div>
      </div>

      <div className="dashboard-lower">
        <div className="dashboard-panel">
          <h3>Revenue Overview</h3>
          <p>Monthly value of won opportunities over the last six months.</p>

          <div className="chart-container">
            {loading ? (
              <p>Loading revenue data...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar
                    dataKey="revenue"
                    fill="#2563eb"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <h3>Sales Pipeline</h3>
          <p>Distribution of opportunities across sales stages.</p>

          <div className="chart-container">
            {loading ? (
              <p>Loading pipeline data...</p>
            ) : pipeline.every(item => item.count === 0) ? (
              <p className="chart-empty-message">
                No opportunities available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipeline.filter(item => item.count > 0)}
                    dataKey="count"
                    nameKey="stage"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {pipeline
                      .filter(item => item.count > 0)
                      .map((item) => (
                        <Cell
                          key={item.stage}
                          fill={COLORS[pipeline.indexOf(item)]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
