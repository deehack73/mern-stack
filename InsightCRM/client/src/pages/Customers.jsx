
import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import api from '../services/api';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  location: '',
  status: 'Prospect'
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/customers', {
        params: {
          search: search || undefined,
          status: status || undefined
        }
      });

      setCustomers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, status]);

  const openAddForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (customer) => {
    setForm({
      fullName: customer.fullName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      industry: customer.industry || '',
      location: customer.location || '',
      status: customer.status || 'Prospect'
    });
    setEditingId(customer._id);
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
        await api.put(`/customers/${editingId}`, form);
      } else {
        await api.post('/customers', form);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await api.delete(`/customers/${id}`);
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete customer.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>Customers</h1>
          <p>Manage and maintain your customer relationships.</p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={17} /> Add Customer
        </button>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <Search size={18} />
          <input
            placeholder="Search name, email or company..."
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
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Prospect">Prospect</option>
        </select>

        <button className="refresh-button" onClick={fetchCustomers}>
          <RefreshCw size={17} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customer-table-container">
        <div className="table-header">
          <div>
            <h3>Customer Directory</h3>
            <span>{customers.length} customers found</span>
          </div>
        </div>

        {loading ? (
          <div className="table-message">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="table-message">No customers found.</div>
        ) : (
          <div className="table-scroll">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <strong>{customer.fullName}</strong>
                      <span className="customer-email">{customer.email}</span>
                    </td>
                    <td>{customer.company || '-'}</td>
                    <td>{customer.industry || '-'}</td>
                    <td>{customer.location || '-'}</td>
                    <td>
                      <span className={`status-badge ${customer.status.toLowerCase()}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-button edit" onClick={() => openEditForm(customer)}>
                          <Pencil size={16} />
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(customer._id)}>
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
                <h2>{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
                <p>Enter the customer information below.</p>
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {[
                  ['fullName', 'Full Name'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['company', 'Company'],
                  ['industry', 'Industry'],
                  ['location', 'Location']
                ].map(([name, label]) => (
                  <label key={name}>
                    {label}{['fullName', 'email'].includes(name) ? ' *' : ''}
                    <input
                      type={name === 'email' ? 'email' : 'text'}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required={['fullName', 'email'].includes(name)}
                    />
                  </label>
                ))}

                <label>
                  Status
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Prospect">Prospect</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
