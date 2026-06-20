import { useState, useEffect, useContext } from 'react';
import { AdminHeader, AdminSearch, AdminTable } from '../../../components/AdminTable/AdminTable';
import { Modal } from '../../../components/Modal/Modal';
import { ConfirmModal } from '../../../components/Modal/Modal';
import Badge from '../../../components/Badge/Badge';
import Button from '../../../components/Button/Button';
import { ToastContext } from '../../../context/AppContext';
import { adminService } from '../../../services/services';
import '../AdminPages.css';

const CATEGORY_ICONS = { transport: '🚗', safety: '⚠️', season: '🌤️', general: '💡', food: '🍴', packing: '🎒' };

const COLUMNS = [
  {
    key: 'text', label: 'Tip',
    render: (v) => <span style={{ fontSize: '13px', color: '#334155' }}>{v?.slice(0, 80)}{v?.length > 80 ? '...' : ''}</span>,
  },
  {
    key: 'category', label: 'Category',
    render: (v) => <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{CATEGORY_ICONS[v] || '💡'} <Badge label={v} color="amber" size="xs" /></span>,
  },
];

const EMPTY = { text: '', category: 'general' };

const AdminTips = () => {
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
      const res = await adminService.getTips();
      setData(res.data);
    } catch { console.error('Failed to load tips'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = data.filter((d) =>
    !search || d.text?.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditTarget(null); setForm(EMPTY); setFormOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setForm({ ...row }); setFormOpen(true); };

  const handleSave = async () => {
    if (!form.text) { showToast('Tip text required', 'warning'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateTip(editTarget.id, form);
        showToast('Updated!', 'success');
      } else {
        await adminService.createTip(form.stop_id || 1, form);
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
      await adminService.deleteTip(deleteTarget.id);
      setData((p) => p.filter((d) => d.id !== deleteTarget.id));
      showToast('Deleted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed.', 'error');
    } finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="admin-page">
      <AdminHeader title="Travel Tips" subtitle="Practical tips to help travelers" count={filtered.length} onAdd={openAdd} addLabel="+ Add Tip" />
      <div className="admin-page__card">
        <div className="admin-page__toolbar">
          <AdminSearch value={search} onChange={setSearch} placeholder="Search tips..." />
        </div>
        <AdminTable columns={COLUMNS} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </div>
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit Tip' : 'Add Travel Tip'} maxWidth={480}>
        <div className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">Category</label>
            <select className="admin-form__select" value={form.category||'general'} onChange={setField('category')}>
              {Object.entries(CATEGORY_ICONS).map(([k, icon]) => (
                <option key={k} value={k}>{icon} {k.charAt(0).toUpperCase() + k.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Tip Text *</label>
            <textarea className="admin-form__textarea" value={form.text||''} onChange={setField('text')} placeholder="Write a helpful travel tip..." style={{ minHeight: 100 }} />
          </div>
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editTarget ? 'Save' : 'Add Tip'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Tip?" message="Delete this tip?" />
    </div>
  );
};

export default AdminTips;