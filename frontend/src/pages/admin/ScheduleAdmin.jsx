import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/admin.css';

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const emptyForm = { id: null, doctor_id: '', hari: 'Senin', jam_mulai: '', jam_selesai: '', nama_poli: '' };

const HARI_COLORS = {
  Senin: '#dcfce7', Selasa: '#dbeafe', Rabu: '#fef9c3',
  Kamis: '#fce7f3', Jumat: '#ede9fe', Sabtu: '#ffedd5', Minggu: '#fee2e2',
};
const HARI_TEXT = {
  Senin: '#15803d', Selasa: '#1d4ed8', Rabu: '#a16207',
  Kamis: '#be185d', Jumat: '#7c3aed', Sabtu: '#c2410c', Minggu: '#dc2626',
};

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <i className={`ti ${type === 'success' ? 'ti-circle-check' : 'ti-circle-x'}`} />
      {msg}
    </div>
  );
};

export default function ScheduleAdmin() {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterHari, setFilterHari] = useState('');

  const fetchData = async () => {
    try {
      const [schedRes, docRes] = await Promise.all([
        api.get('/admin/schedules'),
        api.get('/admin/doctors'),
      ]);
      setSchedules(Array.isArray(schedRes.data) ? schedRes.data : []);
      setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/admin/schedules/${formData.id}`, formData);
        showToast('Jadwal berhasil diperbarui!');
      } else {
        await api.post('/admin/schedules', formData);
        showToast('Jadwal baru berhasil ditambahkan!');
      }
      setFormData(emptyForm);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showToast('Gagal menyimpan jadwal.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sched) => {
    setFormData({
      id: sched.id,
      doctor_id: sched.doctor_id || '',
      hari: sched.hari || 'Senin',
      jam_mulai: sched.jam_mulai || '',
      jam_selesai: sched.jam_selesai || '',
      nama_poli: sched.nama_poli || '',
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      await api.delete(`/admin/schedules/${id}`);
      fetchData();
      showToast('Jadwal berhasil dihapus.');
    } catch (err) {
      showToast('Gagal menghapus jadwal.', 'error');
    }
  };

  const filtered = filterHari ? schedules.filter(s => s.hari === filterHari) : schedules;

  return (
    <div className="admin-page">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-page-header">
        <h1>
          <span className="page-icon"><i className="ti ti-calendar-time" /></span>
          Kelola Jadwal Praktik
        </h1>
        <p>Atur jadwal praktik dokter berdasarkan hari dan jam</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="card-icon"><i className={`ti ${isEditing ? 'ti-edit' : 'ti-calendar-plus'}`} /></span>
          <h2>{isEditing ? 'Edit Jadwal Praktik' : 'Tambah Jadwal Baru'}</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Dokter *</label>
                <select
                  value={formData.doctor_id}
                  onChange={e => setFormData({ ...formData, doctor_id: e.target.value })}
                  required
                >
                  <option value="">— Pilih Dokter —</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.nama} {d.spesialis ? `(${d.spesialis})` : ''}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Hari Praktik *</label>
                <select
                  value={formData.hari}
                  onChange={e => setFormData({ ...formData, hari: e.target.value })}
                >
                  {HARI.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Jam Mulai *</label>
                <input
                  type="time"
                  value={formData.jam_mulai}
                  onChange={e => setFormData({ ...formData, jam_mulai: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Jam Selesai *</label>
                <input
                  type="time"
                  value={formData.jam_selesai}
                  onChange={e => setFormData({ ...formData, jam_selesai: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Nama Poli / Klinik</label>
              <input
                type="text"
                value={formData.nama_poli}
                onChange={e => setFormData({ ...formData, nama_poli: e.target.value })}
                placeholder="Contoh: Poli Anak, Poli Kandungan..."
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading
                  ? <><span className="admin-spinner" /> Menyimpan...</>
                  : <><i className="ti ti-device-floppy" /> {isEditing ? 'Perbarui Jadwal' : 'Simpan Jadwal'}</>
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
            <h2>Jadwal Praktik ({schedules.length})</h2>
          </div>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <select
              value={filterHari}
              onChange={e => setFilterHari(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="">Semua Hari</option>
              {HARI.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Dokter</th>
                <th>Hari</th>
                <th>Poli / Klinik</th>
                <th>Jam Praktik</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sched, i) => (
                <tr key={sched.id}>
                  <td style={{ color: '#9FCB98', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</td>
                  <td><strong style={{ color: '#1e3a21' }}>{sched.doctor?.nama || '-'}</strong></td>
                  <td>
                    <span className="admin-badge" style={{ background: HARI_COLORS[sched.hari] || '#f3f4f6', color: HARI_TEXT[sched.hari] || '#374151' }}>
                      {sched.hari}
                    </span>
                  </td>
                  <td>{sched.nama_poli || '-'}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#346739', fontWeight: 600 }}>
                      <i className="ti ti-clock" style={{ fontSize: '0.8rem' }} />
                      {sched.jam_mulai} – {sched.jam_selesai}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleEdit(sched)}>
                        <i className="ti ti-edit" /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(sched.id)}>
                        <i className="ti ti-trash" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6">
                  <div className="admin-empty-state">
                    <div className="empty-icon"><i className="ti ti-calendar-off" /></div>
                    <p>Belum ada jadwal praktik.</p>
                    <span>Gunakan form di atas untuk menambahkan jadwal dokter.</span>
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
