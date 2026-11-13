
import { useEffect, useState } from 'react';
import {
  Plus, Search, Pencil, Trash2, X, RefreshCw,
  BriefcaseBusiness
} from 'lucide-react';
import api from '../services/api';

const initialForm = {
  opportunityName: '',
  customer: '',
  company: '',
  dealValue: '',
  stage: 'New',
  expectedClosingDate: '',
  description: ''
};

const stages = [
  'New',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost'
];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/opportunities', {
        params: {
          search: search || undefined,
          stage: stage || undefined
        }
      });

      setOpportunities(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.data || []);
    } catch (err) {
      console.error('Customer loading error:', err);
      setError('Unable to load customers for the opportunity form.');
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [search, stage]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openAddForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (item) => {
    setForm({
      opportunityName: item.opportunityName || '',
      customer: item.customer?._id || item.customer || '',
      company: item.company || '',
      dealValue: item.dealValue ?? '',
      stage: item.stage || 'New',
      expectedClosingDate: item.expectedClosingDate
        ? item.expectedClosingDate.slice(0, 10)
        : '',
      description: item.description || ''
    });

    setEditingId(item._id);
    setShowForm(true);
    setError('');
  };

  const handleChange = (e) => {
    const updatedForm = {
      ...form,
      [e.target.name]: e.target.value
    };

    if (e.target.name === 'customer') {
      const selected = customers.find(
        customer => customer._id === e.target.value
      );

      updatedForm.company = selected?.company || '';
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      const payload = {
        ...form,
        dealValue: Number(form.dealValue)
      };

      if (editingId) {
        await api.put(`/opportunities/${editingId}`, payload);
      } else {
        await api.post('/opportunities', payload);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);

      await fetchOpportunities();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save opportunity.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) {
      return;
    }

    try {
      await api.delete(`/opportunities/${id}`);
      await fetchOpportunities();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete opportunity.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Opportunity Management</h1>
          <p>Track deals, revenue potential and sales progress.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={17} /> Add Opportunity
        </button>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <Search size={18} />
          <input
            placeholder="Search opportunity or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="customer-filter"
          value={stage}
          onChange={e => setStage(e.target.value)}
        >
          <option value="">All Stages</option>
          {stages.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <button className="refresh-button" onClick={fetchOpportunities}>
          <RefreshCw size={17} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customer-table-container">
        <div className="table-header">
          <div>
            <h3>Sales Opportunities</h3>
            <span>{opportunities.length} opportunities found</span>
          </div>
          <BriefcaseBusiness size={22} color="#64748b" />
        </div>

        {loading ? (
          <div className="table-message">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="table-message">
            No opportunities found. Add your first opportunity.
          </div>
        ) : (
          <div className="table-scroll">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Customer</th>
                  <th>Deal Value</th>
                  <th>Closing Date</th>
                  <th>Stage</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {opportunities.map(item => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.opportunityName}</strong>
                      <span className="customer-email">{item.company || '-'}</span>
                    </td>

                    <td>
                      {item.customer?.fullName || 'Customer unavailable'}
                    </td>

                    <td>
                      ₹{Number(item.dealValue || 0).toLocaleString('en-IN')}
                    </td>

                    <td>
                      {item.expectedClosingDate
                        ? new Date(item.expectedClosingDate).toLocaleDateString('en-IN')
                        : '-'}
                    </td>

                    <td>
                      <span className={`status-badge ${item.stage.toLowerCase()}`}>
                        {item.stage}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="action-button edit"
                          onClick={() => openEditForm(item)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="customer-modal">
            <div className="modal-heading">
              <div>
                <h2>{editingId ? 'Edit Opportunity' : 'Add Opportunity'}</h2>
                <p>Enter the sales opportunity details.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Opportunity Name *
                  <input
                    name="opportunityName"
                    value={form.opportunityName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Customer *
                  <select
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer._id} value={customer._id}>
                        {customer.fullName} - {customer.company}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Company
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Deal Value (₹) *
                  <input
                    type="number"
                    min="0"
                    name="dealValue"
                    value={form.dealValue}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Sales Stage
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={handleChange}
                  >
                    {stages.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Expected Closing Date
                  <input
                    type="date"
                    name="expectedClosingDate"
                    value={form.expectedClosingDate}
                    onChange={handleChange}
                  />
                </label>

                <label className="full-width-field">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Opportunity' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
