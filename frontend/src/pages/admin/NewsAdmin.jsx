import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/admin.css';

const emptyForm = { id: null, judul: '', isi: '', gambar: null };

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <i className={`ti ${type === 'success' ? 'ti-circle-check' : 'ti-circle-x'}`} />
      {msg}
    </div>
  );
};

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#tambah-berita' && formRef.current) {
      setTimeout(() => formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/news');
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('isi', formData.isi);
    if (formData.gambar) data.append('gambar', formData.gambar);

    try {
      if (isEditing) {
        await api.put(`/admin/news/${formData.id}`, data);
        showToast('Berita berhasil diperbarui!');
      } else {
        await api.post('/admin/news', data);
        showToast('Berita baru berhasil dipublikasikan!');
      }
      setFormData(emptyForm);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showToast('Gagal menyimpan berita.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (n) => {
    setFormData({ id: n.id, judul: n.judul, isi: n.isi, gambar: null });
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return;
    try {
      await api.delete(`/admin/news/${id}`);
      fetchData();
      showToast('Berita berhasil dihapus.');
    } catch (err) {
      showToast('Gagal menghapus berita.', 'error');
    }
  };

  const filtered = news.filter(n => n.judul?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-page-header">
        <h1>
          <span className="page-icon"><i className="ti ti-news" /></span>
          Kelola Berita
        </h1>
        <p>Publikasikan dan kelola artikel berita RSU PKU Muhammadiyah Sragen</p>
      </div>

      <div className="admin-card" ref={formRef}>
        <div className="admin-card-header">
          <span className="card-icon"><i className={`ti ${isEditing ? 'ti-edit' : 'ti-file-plus'}`} /></span>
          <h2>{isEditing ? 'Edit Berita' : 'Tulis Berita Baru'}</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Judul Berita *</label>
              <input
                type="text"
                value={formData.judul}
                onChange={e => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Tulis judul berita yang menarik..."
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Isi Berita *</label>
              <textarea
                rows="8"
                value={formData.isi}
                onChange={e => setFormData({ ...formData, isi: e.target.value })}
                placeholder="Tulis konten berita selengkap mungkin..."
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Gambar Berita {isEditing && '(Kosongkan jika tidak ingin mengubah)'}</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFormData({ ...formData, gambar: e.target.files[0] })}
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading
                  ? <><span className="admin-spinner" /> Menyimpan...</>
                  : <><i className="ti ti-device-floppy" /> {isEditing ? 'Perbarui Berita' : 'Publikasikan'}</>
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
        <div className="admin-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="card-icon"><i className="ti ti-list" /></span>
            <h2>Daftar Berita ({news.length})</h2>
          </div>
          <div className="admin-form-group" style={{ margin: 0, minWidth: 220 }}>
            <input
              type="text"
              placeholder="🔍 Cari judul berita..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => (
                <tr key={n.id}>
                  <td style={{ color: '#9FCB98', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</td>
                  <td><strong style={{ color: '#1e3a21' }}>{n.judul}</strong></td>
                  <td>
                    <div className="table-actions">
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleEdit(n)}>
                        <i className="ti ti-edit" /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(n.id)}>
                        <i className="ti ti-trash" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="3">
                  <div className="admin-empty-state">
                    <div className="empty-icon"><i className="ti ti-news-off" /></div>
                    <p>Belum ada berita yang dipublikasikan.</p>
                    <span>Gunakan form di atas untuk menulis berita baru.</span>
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