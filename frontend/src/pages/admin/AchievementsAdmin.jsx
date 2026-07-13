import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/admin.css';

const emptyForm = { id: null, judul: '', deskripsi: '', tahun: '', gambar: null };

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <i className={`ti ${type === 'success' ? 'ti-circle-check' : 'ti-circle-x'}`} />
      {msg}
    </div>
  );
};

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/achievements');
      setAchievements(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('judul', formData.judul);
    if (formData.deskripsi) data.append('deskripsi', formData.deskripsi);
    if (formData.tahun) data.append('tahun', formData.tahun);
    if (formData.gambar) data.append('gambar', formData.gambar);

    try {
      if (isEditing) {
        await api.put(`/admin/achievements/${formData.id}`, data);
        showToast('Prestasi berhasil diperbarui!');
      } else {
        await api.post('/admin/achievements', data);
        showToast('Prestasi baru berhasil ditambahkan!');
      }
      setFormData(emptyForm);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showToast('Gagal menyimpan prestasi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (a) => {
    setFormData({ id: a.id, judul: a.judul, deskripsi: a.deskripsi || '', tahun: a.tahun || '', gambar: null });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus prestasi ini?')) return;
    try {
      await api.delete(`/admin/achievements/${id}`);
      fetchData();
      showToast('Prestasi berhasil dihapus.');
    } catch (err) {
      showToast('Gagal menghapus prestasi.', 'error');
    }
  };

  return (
    <div className="admin-page">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-page-header">
        <h1>
          <span className="page-icon"><i className="ti ti-trophy" /></span>
          Kelola Prestasi
        </h1>
        <p>Dokumentasikan penghargaan dan pencapaian RSU PKU Muhammadiyah Sragen</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="card-icon"><i className={`ti ${isEditing ? 'ti-edit' : 'ti-award'}`} /></span>
          <h2>{isEditing ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Judul Prestasi *</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Nama penghargaan / prestasi..."
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Tahun</label>
                <input
                  type="number"
                  value={formData.tahun}
                  onChange={e => setFormData({ ...formData, tahun: e.target.value })}
                  placeholder="Contoh: 2024"
                  min="1900"
                  max="2099"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Deskripsi</label>
              <textarea
                rows="4"
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Keterangan lebih lanjut tentang prestasi ini..."
              />
            </div>
            <div className="admin-form-group">
              <label>Gambar / Sertifikat {isEditing && '(Kosongkan jika tidak ingin mengubah)'}</label>
              <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, gambar: e.target.files[0] })} />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading
                  ? <><span className="admin-spinner" /> Menyimpan...</>
                  : <><i className="ti ti-device-floppy" /> {isEditing ? 'Perbarui Prestasi' : 'Simpan Prestasi'}</>
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
          <h2>Daftar Prestasi ({achievements.length})</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Judul Prestasi</th>
                <th>Tahun</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color: '#9FCB98', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</td>
                  <td><strong style={{ color: '#1e3a21' }}>{a.judul}</strong></td>
                  <td>
                    {a.tahun
                      ? <span className="admin-badge admin-badge-active">{a.tahun}</span>
                      : <span style={{ color: '#aaa' }}>-</span>
                    }
                  </td>
                  <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.deskripsi || '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleEdit(a)}>
                        <i className="ti ti-edit" /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(a.id)}>
                        <i className="ti ti-trash" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {achievements.length === 0 && (
                <tr><td colSpan="5">
                  <div className="admin-empty-state">
                    <div className="empty-icon"><i className="ti ti-trophy-off" /></div>
                    <p>Belum ada data prestasi.</p>
                    <span>Gunakan form di atas untuk menambahkan prestasi baru.</span>
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
