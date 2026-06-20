import { useState, useEffect, useContext } from 'react';
import { AdminHeader, AdminSearch, AdminTable } from '../../../components/AdminTable/AdminTable';
import { Modal } from '../../../components/Modal/Modal';
import { ConfirmModal } from '../../../components/Modal/Modal';
import Badge from '../../../components/Badge/Badge';
import Button from '../../../components/Button/Button';
import { ToastContext } from '../../../context/AppContext';
import { adminService } from '../../../services/services';
import { formatBudgetRange, formatDuration } from '../../../utils/utils';
import '../AdminPages.css';

const COLUMNS = [
  {
    key: 'name',
    label: 'Route Name',
    render: (v) => <strong style={{ color: '#0f172a' }}>{v}</strong>,
  },
  {
    key: 'source',
    label: 'From → To',
    render: (_, row) => (
      <span style={{ fontWeight: 500 }}>
        {row.source} → {row.destination}
      </span>
    ),
  },
  {
    key: 'duration_min',
    label: 'Duration',
    render: (_, row) => formatDuration(row.duration_min, row.duration_max),
  },
  {
    key: 'budget_min',
    label: 'Budget',
    render: (_, row) => (
      <span style={{ fontSize: '13px' }}>
        {formatBudgetRange(row.budget_min, row.budget_max)}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (v) => (
      <Badge label={v} color={v === 'published' ? 'green' : 'gray'} />
    ),
  },
];

const EMPTY_FORM = {
  name: '', source: '', destination: '',
  transport_type: 'Road',
  duration_min: '', duration_max: '',
  distance_km: '', budget_min: '', budget_max: '',
  description: '', status: 'draft',
};

const AdminRoutes = () => {
  const { showToast } = useContext(ToastContext);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── LOAD ROUTES ──
  const loadRoutes = async () => {
    try {
      const res = await adminService.getRoutes();
      setRoutes(res.data);
    } catch (err) {
      console.error('Failed to load routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRoutes(); }, []);

  const filtered = routes.filter((r) =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.source.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (k) => (e) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM });
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditTarget(row);
    setForm({ ...row });
    setFormOpen(true);
  };

  // ── SAVE (CREATE or UPDATE) ──
  const handleSave = async () => {
    if (!form.name || !form.source || !form.destination) {
      showToast('Name, source and destination are required', 'warning');
      return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateRoute(editTarget.id, form);
        showToast('Route updated!', 'success');
      } else {
        await adminService.createRoute(form);
        showToast('Route created!', 'success');
      }
      await loadRoutes();
      setFormOpen(false);
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteRoute(deleteTarget.id);
      setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast('Route deleted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to delete.', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="admin-page">
      <AdminHeader
        title="Routes"
        subtitle="Manage all travel routes on the platform"
        count={filtered.length}
        onAdd={openAdd}
        addLabel="+ Add Route"
      />

      <div className="admin-page__card">
        <div className="admin-page__toolbar">
          <AdminSearch value={search} onChange={setSearch} placeholder="Search routes..." />
        </div>
        <AdminTable
          columns={COLUMNS}
          rows={filtered}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          loading={loading}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? 'Edit Route' : 'Add New Route'}
        maxWidth={560}
      >
        <div className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">Route Name *</label>
            <input className="admin-form__input" value={form.name} onChange={setField('name')} placeholder="e.g. Delhi to Kashmir" />
          </div>
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Source City *</label>
              <input className="admin-form__input" value={form.source} onChange={setField('source')} placeholder="Delhi" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Destination *</label>
              <input className="admin-form__input" value={form.destination} onChange={setField('destination')} placeholder="Kashmir" />
            </div>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Min Days</label>
              <input className="admin-form__input" type="number" value={form.duration_min} onChange={setField('duration_min')} placeholder="2" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Max Days</label>
              <input className="admin-form__input" type="number" value={form.duration_max} onChange={setField('duration_max')} placeholder="5" />
            </div>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Budget Min (₹)</label>
              <input className="admin-form__input" type="number" value={form.budget_min} onChange={setField('budget_min')} placeholder="5000" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Budget Max (₹)</label>
              <input className="admin-form__input" type="number" value={form.budget_max} onChange={setField('budget_max')} placeholder="20000" />
            </div>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Distance (km)</label>
              <input className="admin-form__input" type="number" value={form.distance_km} onChange={setField('distance_km')} placeholder="830" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Status</label>
              <select className="admin-form__select" value={form.status} onChange={setField('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Description</label>
            <textarea className="admin-form__textarea" value={form.description} onChange={setField('description')} placeholder="Describe this route..." />
          </div>
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editTarget ? 'Save Changes' : 'Create Route'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Route?"
        message={`Delete "${deleteTarget?.name}"? All stops and itineraries will also be removed.`}
      />
    </div>
  );
};

export default AdminRoutes;