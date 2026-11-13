
import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import api from '../services/api';

const initialForm = {
  leadName: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  priority: 'Medium',
  status: 'New',
  expectedDealValue: 0
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/leads', {
        params: {
          search: search || undefined,
          status: status || undefined
        }
      });

      setLeads(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, status]);

  const openAddForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (lead) => {
    setForm({
      leadName: lead.leadName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      source: lead.source || 'Website',
      priority: lead.priority || 'Medium',
      status: lead.status || 'New',
      expectedDealValue: lead.expectedDealValue || 0
    });

    setEditingId(lead._id);
    setShowForm(true);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      const payload = {
        ...form,
        expectedDealValue: Number(form.expectedDealValue)
      };

      if (editingId) {
        await api.put(`/leads/${editingId}`, payload);
      } else {
        await api.post('/leads', payload);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save lead.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      await api.delete(`/leads/${id}`);
      await fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete lead.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Lead Management</h1>
          <p>Track potential customers and manage your sales prospects.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={17} /> Add Lead
        </button>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <Search size={18} />
          <input
            placeholder="Search lead name, email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="customer-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>

        <button className="refresh-button" onClick={fetchLeads}>
          <RefreshCw size={17} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customer-table-container">
        <div className="table-header">
          <div>
            <h3>Lead Directory</h3>
            <span>{leads.length} leads found</span>
          </div>
        </div>

        {loading ? (
          <div className="table-message">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="table-message">No leads found. Add your first lead.</div>
        ) : (
          <div className="table-scroll">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Deal Value</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <strong>{lead.leadName}</strong>
                      <span className="customer-email">{lead.email}</span>
                    </td>
                    <td>{lead.company || '-'}</td>
                    <td>{lead.source}</td>
                    <td>₹{Number(lead.expectedDealValue || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`status-badge ${lead.priority.toLowerCase()}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${lead.status.toLowerCase()}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-button edit" onClick={() => openEditForm(lead)}>
                          <Pencil size={16} />
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(lead._id)}>
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
                <h2>{editingId ? 'Edit Lead' : 'Add Lead'}</h2>
                <p>Enter the lead information below.</p>
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Lead Name *
                  <input name="leadName" value={form.leadName} onChange={handleChange} required />
                </label>

                <label>
                  Email
                  <input type="email" name="email" value={form.email} onChange={handleChange} />
                </label>

                <label>
                  Phone
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </label>

                <label>
                  Company
                  <input name="company" value={form.company} onChange={handleChange} />
                </label>

                <label>
                  Source
                  <select name="source" value={form.source} onChange={handleChange}>
                    <option>Website</option>
                    <option>Social Media</option>
                    <option>Referral</option>
                    <option>Advertisement</option>
                    <option>Direct Contact</option>
                  </select>
                </label>

                <label>
                  Expected Deal Value (₹)
                  <input
                    type="number"
                    min="0"
                    name="expectedDealValue"
                    value={form.expectedDealValue}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Priority
                  <select name="priority" value={form.priority} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>

                <label>
                  Status
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Converted</option>
                    <option>Lost</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Lead' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
