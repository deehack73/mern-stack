
import { useEffect, useState } from 'react';
import {
  Plus, Search, Pencil, Trash2, X, RefreshCw, CalendarCheck
} from 'lucide-react';
import api from '../services/api';

const initialForm = {
  title: '',
  customer: '',
  activityType: 'Meeting',
  description: '',
  date: '',
  status: 'Pending'
};

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/activities', {
        params: {
          search: search || undefined,
          status: status || undefined
        }
      });

      setActivities(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load activities.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.data || []);
    } catch (err) {
      setError('Unable to load customer list.');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [search, status]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openAddForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (activity) => {
    setForm({
      title: activity.title || '',
      customer: activity.customer?._id || activity.customer || '',
      activityType: activity.activityType || 'Meeting',
      description: activity.description || '',
      date: activity.date ? activity.date.slice(0, 10) : '',
      status: activity.status || 'Pending'
    });

    setEditingId(activity._id);
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

      if (editingId) {
        await api.put(`/activities/${editingId}`, form);
      } else {
        await api.post('/activities', form);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save activity.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;

    try {
      await api.delete(`/activities/${id}`);
      await fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete activity.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Activity Management</h1>
          <p>Schedule and track customer interactions and follow-ups.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={17} /> Add Activity
        </button>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <Search size={18} />
          <input
            placeholder="Search activity..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="customer-filter"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button className="refresh-button" onClick={fetchActivities}>
          <RefreshCw size={17} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customer-table-container">
        <div className="table-header">
          <div>
            <h3>Activity Directory</h3>
            <span>{activities.length} activities found</span>
          </div>
          <CalendarCheck size={22} color="#64748b" />
        </div>

        {loading ? (
          <div className="table-message">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="table-message">No activities found. Add your first activity.</div>
        ) : (
          <div className="table-scroll">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {activities.map(activity => (
                  <tr key={activity._id}>
                    <td>
                      <strong>{activity.title}</strong>
                      <span className="customer-email">
                        {activity.description || '-'}
                      </span>
                    </td>

                    <td>{activity.customer?.fullName || 'Unavailable'}</td>
                    <td>{activity.activityType}</td>
                    <td>
                      {activity.date
                        ? new Date(activity.date).toLocaleDateString('en-IN')
                        : '-'}
                    </td>

                    <td>
                      <span className={`status-badge ${activity.status.toLowerCase()}`}>
                        {activity.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="action-button edit"
                          onClick={() => openEditForm(activity)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(activity._id)}
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
                <h2>{editingId ? 'Edit Activity' : 'Add Activity'}</h2>
                <p>Enter the activity details below.</p>
              </div>

              <button className="modal-close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Activity Title *
                  <input
                    name="title"
                    value={form.title}
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
                        {customer.fullName}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Activity Type
                  <select
                    name="activityType"
                    value={form.activityType}
                    onChange={handleChange}
                  >
                    <option>Phone Call</option>
                    <option>Email</option>
                    <option>Meeting</option>
                    <option>Follow-up</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Date *
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Status
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
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

                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Activity' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
