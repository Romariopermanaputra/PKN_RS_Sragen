import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { IMAGE_URL } from '../../services/api';
import '../../../src/styles/admin.css';

const emptyForm = {
  id: null,
  nama: '',
  spesialis: '',
  subspesialis: '',
  deskripsi: '',
  status_aktif: true,
  foto: null,
};

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <i className={`ti ${type === 'success' ? 'ti-circle-check' : 'ti-circle-x'}`} />
      {msg}
    </div>
  );
};

export default function DoctorsAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [subspecialties, setSubspecialties] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#tambah-dokter' && formRef.current) {
      setTimeout(() => formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [location]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  const fetchSpecialties = async () => {
    try {
      const [s, ss] = await Promise.all([
        api.get('/doctors/specialties'),
        api.get('/doctors/subspecialties'),
      ]);
      setSpecialties(Array.isArray(s.data) ? s.data : []);
      setSubspecialties(Array.isArray(ss.data) ? ss.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDoctors(); fetchSpecialties(); }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('spesialis', formData.spesialis);
    data.append('subspesialis', formData.subspesialis);
    data.append('deskripsi', formData.deskripsi);
    data.append('status_aktif', formData.status_aktif ? 'true' : 'false');
    if (formData.foto) data.append('foto', formData.foto);

    try {
      if (isEditing) {
        await api.put(`/admin/doctors/${formData.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Data dokter berhasil diperbarui!');
      } else {
        await api.post('/admin/doctors', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Dokter baru berhasil ditambahkan!');
      }
      setFormData(emptyForm);
      setIsEditing(false);
      fetchDoctors();
      fetchSpecialties();
    } catch (err) {
      showToast('Gagal menyimpan data dokter.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setFormData({
      id: doc.id,
      nama: doc.nama || '',
      spesialis: doc.spesialis || '',
      subspesialis: doc.subspesialis || '',
      deskripsi: doc.deskripsi || '',
      status_aktif: doc.status_aktif ?? true,
      foto: null,
    });
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus dokter ini?')) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      fetchDoctors();
      showToast('Dokter berhasil dihapus.');
    } catch (err) {
      showToast('Gagal menghapus dokter.', 'error');
    }
  };

  const handleCancel = () => { setIsEditing(false); setFormData(emptyForm); };

  const filtered = doctors.filter(d =>
    d.nama?.toLowerCase().includes(search.toLowerCase()) ||
    d.spesialis?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="admin-page-header">
        <h1>
          <span className="page-icon"><i className="ti ti-stethoscope" /></span>
          Kelola Dokter
        </h1>
        <p>Tambah, edit, dan kelola data dokter RSU PKU Muhammadiyah Sragen</p>
      </div>

      {/* Form Card */}
      <div className="admin-card" ref={formRef}>
        <div className="admin-card-header">
          <span className="card-icon"><i className={`ti ${isEditing ? 'ti-edit' : 'ti-user-plus'}`} /></span>
          <h2>{isEditing ? 'Edit Data Dokter' : 'Tambah Dokter Baru'}</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="dr. Nama Dokter, Sp.X"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Spesialisasi *</label>
                <input
                  list="spesialis-options"
                  type="text"
                  value={formData.spesialis}
                  onChange={e => setFormData({ ...formData, spesialis: e.target.value })}
                  placeholder="Contoh: Anak"
                  required
                />
                <datalist id="spesialis-options">
                  {specialties.map(item => <option key={item} value={item} />)}
                </datalist>
              </div>
              <div className="admin-form-group">
                <label>Subspesialisasi</label>
                <input
                  list="subspesialis-options"
                  type="text"
                  value={formData.subspesialis}
                  onChange={e => setFormData({ ...formData, subspesialis: e.target.value })}
                  placeholder="Opsional"
                />
                <datalist id="subspesialis-options">
                  {subspecialties.map(item => <option key={item} value={item} />)}
                </datalist>
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={formData.status_aktif ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, status_aktif: e.target.value === 'true' })}
                >
                  <option value="true">✓ Aktif</option>
                  <option value="false">✗ Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Profil / Biografi</label>
              <textarea
                rows="5"
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Riwayat pendidikan, pengalaman, dan keahlian dokter..."
              />
            </div>
            <div className="admin-form-group">
              <label>Foto Dokter</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFormData({ ...formData, foto: e.target.files[0] })}
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading
                  ? <><span className="admin-spinner" /> Menyimpan...</>
                  : <><i className="ti ti-device-floppy" /> {isEditing ? 'Perbarui Data' : 'Simpan Dokter'}</>
                }
              </button>
              {isEditing && (
                <button type="button" className="admin-btn admin-btn-secondary" onClick={handleCancel}>
                  <i className="ti ti-x" /> Batal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="card-icon"><i className="ti ti-list" /></span>
            <h2>Daftar Dokter ({doctors.length})</h2>
          </div>
          <div className="admin-form-group" style={{ margin: 0, minWidth: 220 }}>
            <input
              type="text"
              placeholder="🔍 Cari nama / spesialisasi..."
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
                <th>Foto</th>
                <th>Nama Dokter</th>
                <th>Spesialisasi</th>
                <th>Subspesialisasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc.id}>
                  <td style={{ color: '#9FCB98', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</td>
                  <td>
                    {doc.foto
                      ? <img src={`${IMAGE_URL}${doc.foto}`} alt={doc.nama} className="admin-avatar" onError={e => e.target.style.display='none'} />
                      : <div className="admin-avatar-placeholder"><i className="ti ti-user" /></div>
                    }
                  </td>
                  <td><strong style={{ color: '#1e3a21' }}>{doc.nama}</strong></td>
                  <td>{doc.spesialis || '-'}</td>
                  <td>{doc.subspesialis || '-'}</td>
                  <td>
                    <span className={`admin-badge ${doc.status_aktif ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                      <i className={`ti ${doc.status_aktif ? 'ti-check' : 'ti-x'}`} />
                      {doc.status_aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleEdit(doc)}>
                        <i className="ti ti-edit" /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(doc.id)}>
                        <i className="ti ti-trash" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-state">
                      <div className="empty-icon"><i className="ti ti-user-off" /></div>
                      <p>{search ? 'Tidak ada dokter yang cocok dengan pencarian.' : 'Belum ada data dokter.'}</p>
                      <span>{search ? '' : 'Gunakan form di atas untuk menambahkan dokter baru.'}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
