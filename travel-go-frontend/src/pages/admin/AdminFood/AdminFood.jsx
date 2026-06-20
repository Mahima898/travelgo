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
  { key: 'dish', label: 'Dish', render: (v) => <strong>{v}</strong> },
  { key: 'name', label: 'Place' },
  { key: 'destination_name', label: 'Destination', render: (_, row) => row.stop_id ? `Stop #${row.stop_id}` : '—' },
  { key: 'price_range', label: 'Price', render: (v) => <Badge label={v || 'Budget'} color={v === 'Budget' ? 'green' : v === 'Mid-range' ? 'amber' : 'red'} /> },
];

const EMPTY = { dish: '', name: '', where: '', price_range: 'Budget', description: '' };

const AdminFood = () => {
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
      const res = await adminService.getFood();
      setData(res.data);
    } catch { console.error('Failed to load food'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = data.filter((d) =>
    !search || d.dish?.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditTarget(null); setForm(EMPTY); setFormOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setForm({ ...row }); setFormOpen(true); };

  const handleSave = async () => {
    if (!form.dish) { showToast('Dish name required', 'warning'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateFood(editTarget.id, form);
        showToast('Updated!', 'success');
      } else {
        await adminService.createFood(form.stop_id || 1, form);
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
      await adminService.deleteFood(deleteTarget.id);
      setData((p) => p.filter((d) => d.id !== deleteTarget.id));
      showToast('Deleted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed.', 'error');
    } finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="admin-page">
      <AdminHeader title="Food Recommendations" subtitle="Manage what travelers should eat along each route" count={filtered.length} onAdd={openAdd} addLabel="+ Add Food" />
      <div className="admin-page__card">
        <div className="admin-page__toolbar">
          <AdminSearch value={search} onChange={setSearch} placeholder="Search food..." />
        </div>
        <AdminTable columns={COLUMNS} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </div>
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit Food' : 'Add Food'} maxWidth={500}>
        <div className="admin-form">
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Dish Name *</label>
              <input className="admin-form__input" value={form.dish||''} onChange={setField('dish')} placeholder="Rajma Chawal" />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Place / Restaurant</label>
              <input className="admin-form__input" value={form.name||''} onChange={setField('name')} placeholder="Kesar Da Dhaba" />
            </div>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Location</label>
            <input className="admin-form__input" value={form.where||''} onChange={setField('where')} placeholder="Jammu City" />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Price Range</label>
            <select className="admin-form__select" value={form.price_range||'Budget'} onChange={setField('price_range')}>
              <option>Budget</option><option>Mid-range</option><option>Premium</option>
            </select>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Description</label>
            <textarea className="admin-form__textarea" value={form.description||''} onChange={setField('description')} placeholder="Why must travelers try this?" />
          </div>
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editTarget ? 'Save' : 'Add Food'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Food Entry?" message={`Delete "${deleteTarget?.dish}"?`} />
    </div>
  );
};

export default AdminFood;