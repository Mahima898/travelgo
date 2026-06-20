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
  { key: 'name',        label: 'Name',        render: (v) => <strong>{v}</strong> },
  { key: 'region',      label: 'Region' },
  { key: 'best_season', label: 'Best Season' },
  {
    key: 'tags', label: 'Tags',
    render: (tags) => (
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {(tags || []).map((t) => <Badge key={t} label={t} size="xs" />)}
      </div>
    ),
  },
];

const EMPTY = { name: '', region: '', best_season: '', description: '', cover_image: '' };

const AdminDestinations = () => {
  const { showToast } = useContext(ToastContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const res = await adminService.getDestinations();
      setData(res.data);
    } catch { console.error('Failed to load destinations'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = data.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditTarget(null); setForm(EMPTY); setFormOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setForm({ ...row }); setFormOpen(true); };

  const handleSave = async () => {
    if (!form.name) { showToast('Name is required', 'warning'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateDestination(editTarget.id, form);
        showToast('Updated!', 'success');
      } else {
        await adminService.createDestination(form);
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
      await adminService.deleteDestination(deleteTarget.id);
      setData((p) => p.filter((d) => d.id !== deleteTarget.id));
      showToast('Deleted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed.', 'error');
    } finally { setDeleting(false); setDeleteTarget(null); }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };

  return (
    <div className="admin-page">
      <AdminHeader title="Destinations" subtitle="Manage all destinations" count={filtered.length} onAdd={openAdd} addLabel="+ Add Destination" />
      <div className="admin-page__card">
        <div className="admin-page__toolbar">
          <AdminSearch value={search} onChange={setSearch} placeholder="Search destinations..." />
        </div>
        <AdminTable columns={COLUMNS} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </div>
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit Destination' : 'Add Destination'} maxWidth={500}>
        <div className="admin-form">
          {[['name','Name *','e.g. Kashmir'],['region','Region','Jammu & Kashmir, India'],['best_season','Best Season','October to March'],['cover_image','Cover Image URL','https://...']].map(([k,l,p]) => (
            <div key={k} className="admin-form__group">
              <label className="admin-form__label">{l}</label>
              <input className="admin-form__input" value={form[k]||''} onChange={setField(k)} placeholder={p} />
            </div>
          ))}
          <div className="admin-form__group">
            <label className="admin-form__label">Description</label>
            <textarea className="admin-form__textarea" value={form.description||''} onChange={setField('description')} placeholder="Describe this destination..." />
          </div>
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editTarget ? 'Save' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Destination?" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  );
};

export default AdminDestinations;