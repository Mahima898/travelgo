import { useState, useEffect, useContext } from 'react';
import { AdminHeader, AdminSearch, AdminTable } from '../../../components/AdminTable/AdminTable';
import { Modal } from '../../../components/Modal/Modal';
import { ConfirmModal } from '../../../components/Modal/Modal';
import Badge from '../../../components/Badge/Badge';
import Button from '../../../components/Button/Button';
import { ToastContext } from '../../../context/AppContext';
import { adminService } from '../../../services/services';
import '../AdminPages.css';

const COLUMNS = [
  { key: 'name', label: 'Name', render: (v) => <strong>{v}</strong> },
  {
    key: 'type', label: 'Type',
    render: (v) => <Badge label={v === 'hidden_gem' ? 'Hidden Gem' : 'Attraction'} color={v === 'hidden_gem' ? 'green' : 'blue'} />,
  },
  { key: 'destination_name', label: 'Destination' },
  {
    key: 'description', label: 'Description',
    render: (v) => <span style={{ fontSize: '13px', color: '#64748b' }}>{v?.slice(0, 60)}...</span>,
  },
];

const EMPTY = { name: '', type: 'attraction', destination_name: '', description: '', why_special: '' };

const AdminAttractions = () => {
  const { showToast } = useContext(ToastContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const res = await adminService.getAttractions();
      setData(res.data);
    } catch { console.error('Failed to load attractions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = data.filter((d) =>
    (typeFilter === 'all' || d.type === typeFilter) &&
    (!search || d.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditTarget(null); setForm(EMPTY); setFormOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setForm({ ...row }); setFormOpen(true); };

  const handleSave = async () => {
    if (!form.name) { showToast('Name required', 'warning'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateAttraction(editTarget.id, form);
        showToast('Updated!', 'success');
      } else {
        await adminService.createAttraction(form.stop_id || 1, form);
        showToast('Created!', 'success');
      }
      await loadData();
      setFormOpen(false);
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteAttraction(deleteTarget.id);
      setData((p) => p.filter((d) => d.id !== deleteTarget.id));
      showToast('Deleted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed.', 'error');
    } finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="admin-page">
      <AdminHeader title="Attractions & Hidden Gems" subtitle="Manage what travelers discover at each stop" count={filtered.length} onAdd={openAdd} addLabel="+ Add Attraction" />
      <div className="admin-page__card">
        <div className="admin-page__toolbar">
          <AdminSearch value={search} onChange={setSearch} placeholder="Search attractions..." />
          {['all', 'attraction', 'hidden_gem'].map((f) => (
            <button key={f} className={`admin-page__filter-pill ${typeFilter === f ? 'admin-page__filter-pill--active' : ''}`} onClick={() => setTypeFilter(f)}>
              {f === 'all' ? 'All' : f === 'attraction' ? 'Attractions' : 'Hidden Gems'}
            </button>
          ))}
        </div>
        <AdminTable columns={COLUMNS} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </div>
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit' : 'Add Attraction'} maxWidth={500}>
        <div className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">Type</label>
            <select className="admin-form__select" value={form.type} onChange={setField('type')}>
              <option value="attraction">Attraction</option>
              <option value="hidden_gem">Hidden Gem</option>
            </select>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Name *</label>
              <input className="admin-form__input" value={form.name||''} onChange={setField('name')} placeholder="e.g. Dal Lake" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Destination</label>
              <input className="admin-form__input" value={form.destination_name||''} onChange={setField('destination_name')} placeholder="Kashmir" />
            </div>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Description</label>
            <textarea className="admin-form__textarea" value={form.description||''} onChange={setField('description')} placeholder="Describe..." />
          </div>
          {form.type === 'hidden_gem' && (
            <div className="admin-form__group">
              <label className="admin-form__label">Why It's Special</label>
              <textarea className="admin-form__textarea" value={form.why_special||''} onChange={setField('why_special')} placeholder="What makes this a hidden gem?" style={{ minHeight: 60 }} />
            </div>
          )}
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editTarget ? 'Save' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete?" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  );
};

export default AdminAttractions;