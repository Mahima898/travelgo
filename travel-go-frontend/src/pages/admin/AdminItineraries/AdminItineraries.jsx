import { useState, useEffect, useContext } from 'react';
import { AdminHeader, AdminSearch, AdminTable } from '../../../components/AdminTable/AdminTable';
import { Modal } from '../../../components/Modal/Modal';
import { ConfirmModal } from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';
import { ToastContext } from '../../../context/AppContext';
import { adminService, routeService } from '../../../services/services';
import '../AdminPages.css';

const COLUMNS = [
  { key: 'name',       label: 'Itinerary Name', render: (v) => <strong>{v}</strong> },
  { key: 'route_name', label: 'Route' },
  { key: 'total_days', label: 'Total Days',  render: (v) => `${v} Days` },
  { key: 'days_count', label: 'Days Added',  render: (v) => `${v} day plans` },
];

const EMPTY = { name: '', route_id: '', total_days: 5 };

const AdminItineraries = () => {
  const { showToast } = useContext(ToastContext);
  const [data, setData] = useState([]);
  const [routes, setRoutes] = useState([]);
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
      const [iRes, rRes] = await Promise.all([
        adminService.getItineraries(),
        routeService.getAll(),
      ]);
      setData(iRes.data);
      setRoutes(rRes.data);
    } catch { console.error('Failed to load itineraries'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = data.filter((d) =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const openAdd = () => { setEditTarget(null); setForm(EMPTY); setFormOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setForm({ ...row }); setFormOpen(true); };

  const handleSave = async () => {
    if (!form.name) { showToast('Name required', 'warning'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await adminService.updateItinerary(editTarget.id, {
          name: form.name,
          total_days: parseInt(form.total_days),
        });
        showToast('Updated!', 'success');
      } else {
        await adminService.createItinerary(
          parseInt(form.route_id),
          form.name,
          parseInt(form.total_days)
        );
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
      await adminService.deleteItinerary(deleteTarget.id);
      setData((p) => p.filter((d) => d.id !== deleteTarget.id));
      showToast('Deleted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed.', 'error');
    } finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="admin-page">
      <AdminHeader title="Itineraries" subtitle="Day-by-day travel plans for each route" count={filtered.length} onAdd={openAdd} addLabel="+ Add Itinerary" />
      <div className="admin-page__card">
        <div className="admin-page__toolbar">
          <AdminSearch value={search} onChange={setSearch} placeholder="Search itineraries..." />
        </div>
        <AdminTable columns={COLUMNS} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} loading={loading} />
      </div>
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit Itinerary' : 'Add Itinerary'} maxWidth={460}>
        <div className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">Itinerary Name *</label>
            <input className="admin-form__input" value={form.name||''} onChange={setField('name')} placeholder="Classic Delhi to Kashmir" />
          </div>
          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">Route</label>
              <select className="admin-form__select" value={form.route_id||''} onChange={setField('route_id')}>
                <option value="">Select a route</option>
                {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">Total Days</label>
              <input className="admin-form__input" type="number" value={form.total_days||5} onChange={setField('total_days')} min="1" />
            </div>
          </div>
          <div className="admin-form__info">
            ℹ️ After creating, add day-by-day plans from the route detail page.
          </div>
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editTarget ? 'Save' : 'Create Itinerary'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Itinerary?" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  );
};

export default AdminItineraries;