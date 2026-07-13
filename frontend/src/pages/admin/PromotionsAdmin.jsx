import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/admin.css';

const emptyForm = { id: null, judul: '', deskripsi: '', tanggal_mulai: '', tanggal_berakhir: '', gambar: null };

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <i className={`ti ${type === 'success' ? 'ti-circle-check' : 'ti-circle-x'}`} />
      {msg}
    </div>
  );
};

export default function PromotionsAdmin() {
  const [promotions, setPromotions] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#tambah-promosi' && formRef.current) {
      setTimeout(() => formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/promotions');
      setPromotions(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('tanggal_mulai', formData.tanggal_mulai);
    data.append('tanggal_berakhir', formData.tanggal_berakhir);
    if (formData.deskripsi) data.append('deskripsi', formData.deskripsi);
    if (formData.gambar) data.append('gambar', formData.gambar);

    try {
      if (isEditing) {
        await api.put(`/admin/promotions/${formData.id}`, data);
        showToast('Promo berhasil diperbarui!');
      } else {
        await api.post('/admin/promotions', data);
        showToast('Promo baru berhasil ditambahkan!');
      }
      setFormData(emptyForm);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showToast('Gagal menyimpan promo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id: p.id,
      judul: p.judul,
      deskripsi: p.deskripsi || '',
      tanggal_mulai: p.tanggal_mulai?.split('T')[0] || '',
      tanggal_berakhir: p.tanggal_berakhir?.split('T')[0] || '',
      gambar: null,
    });
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus promo ini?')) return;
    try {
      await api.delete(`/admin/promotions/${id}`);
      fetchData();
      showToast('Promo berhasil dihapus.');
    } catch (err) {
      showToast('Gagal menghapus promo.', 'error');
    }
  };

  const fmt = (date) => date ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
  const isActive = (p) => {
    const now = new Date();
    return new Date(p.tanggal_mulai) <= now && new Date(p.tanggal_berakhir) >= now;
  };

  return (
    <div className="admin-page">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-page-header">
        <h1>
          <span className="page-icon"><i className="ti ti-discount-2" /></span>
          Kelola Promo
        </h1>
        <p>Kelola promosi dan penawaran spesial RSU PKU Muhammadiyah Sragen</p>
      </div>

      <div className="admin-card" ref={formRef}>
        <div className="admin-card-header">
          <span className="card-icon"><i className={`ti ${isEditing ? 'ti-edit' : 'ti-plus'}`} /></span>
          <h2>{isEditing ? 'Edit Promo' : 'Tambah Promo Baru'}</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Judul Promo *</label>
              <input
                type="text"
                value={formData.judul}
                onChange={e => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Nama/judul promo yang menarik..."
                required
              />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Tanggal Mulai *</label>
                <input
                  type="date"
                  value={formData.tanggal_mulai}
                  onChange={e => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Tanggal Berakhir *</label>
                <input
                  type="date"
                  value={formData.tanggal_berakhir}
                  onChange={e => setFormData({ ...formData, tanggal_berakhir: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Deskripsi</label>
              <textarea
                rows="4"
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Detail informasi promo, syarat & ketentuan..."
              />
            </div>
            <div className="admin-form-group">
              <label>Gambar Promo {isEditing && '(Kosongkan jika tidak ingin mengubah)'}</label>
              <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, gambar: e.target.files[0] })} />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading
                  ? <><span className="admin-spinner" /> Menyimpan...</>
                  : <><i className="ti ti-device-floppy" /> {isEditing ? 'Perbarui Promo' : 'Simpan Promo'}</>
                }
              </button>
              {isEditing && (
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => { setIsEditing(false); setFormData(emptyForm); }}>
                  <i className="ti ti-x" /> Batal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="card-icon"><i className="ti ti-list" /></span>
          <h2>Daftar Promo ({promotions.length})</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Judul Promo</th>
                <th>Mulai</th>
                <th>Berakhir</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: '#9FCB98', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</td>
                  <td><strong style={{ color: '#1e3a21' }}>{p.judul}</strong></td>
                  <td>{fmt(p.tanggal_mulai)}</td>
                  <td>{fmt(p.tanggal_berakhir)}</td>
                  <td>
                    <span className={`admin-badge ${isActive(p) ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                      <i className={`ti ${isActive(p) ? 'ti-check' : 'ti-clock'}`} />
                      {isActive(p) ? 'Aktif' : 'Berakhir'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleEdit(p)}>
                        <i className="ti ti-edit" /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p.id)}>
                        <i className="ti ti-trash" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && (
                <tr><td colSpan="6">
                  <div className="admin-empty-state">
                    <div className="empty-icon"><i className="ti ti-discount-off" /></div>
                    <p>Belum ada data promo.</p>
                    <span>Gunakan form di atas untuk menambahkan promo baru.</span>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}