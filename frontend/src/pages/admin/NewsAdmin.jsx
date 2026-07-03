import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({ id: null, judul: '', isi: '', gambar: null });
  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#tambah-berita' && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      formRef.current.classList.add('ring-2', 'ring-teal-500', 'transition-all');
      setTimeout(() => {
        formRef.current.classList.remove('ring-2', 'ring-teal-500');
      }, 2000);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/news');
      setNews(res.data);
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Buat FormData
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('isi', formData.isi);
    
    // 2. Append gambar HANYA jika ada file yang dipilih
    if (formData.gambar) {
      data.append('gambar', formData.gambar);
    }

    try {
      // ✅ PERBAIKAN UTAMA:
      // Kirim 'data' (FormData) LANGSUNG sebagai parameter kedua.
      // JANGAN menambahkan config headers { 'Content-Type': 'multipart/form-data' } di sini.
      // Axios akan otomatis mendeteksi ini adalah FormData dan mengatur header + boundary yang benar.
      
      if (isEditing) {
        await api.put(`/admin/news/${formData.id}`, data);
      } else {
        await api.post('/admin/news', data);
      }
      
      // Reset form setelah sukses
      setFormData({ id: null, judul: '', isi: '', gambar: null });
      setIsEditing(false);
      fetchData();
      alert('Berita berhasil disimpan!');
    } catch (err) { 
      console.error('Error submit berita:', err);
      alert('Gagal menyimpan berita'); 
    }
  };

  const handleEdit = (n) => {
    setFormData({ id: n.id, judul: n.judul, isi: n.isi, gambar: null });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus?')) {
      await api.delete(`/admin/news/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kelola Berita</h1>
      
      <div ref={formRef} className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit' : 'Tambah'} Berita</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Judul</label>
            <input 
              type="text" 
              className="w-full border p-2" 
              value={formData.judul} 
              onChange={e => setFormData({...formData, judul: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm">Isi Berita</label>
            <textarea 
              className="w-full border p-2 h-32" 
              value={formData.isi} 
              onChange={e => setFormData({...formData, isi: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm">Gambar {isEditing && '(Kosongkan jika tidak ingin mengubah gambar)'}</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFormData({...formData, gambar: e.target.files[0]})} 
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setFormData({ id: null, judul: '', isi: '', gambar: null }); }} 
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">Judul</th>
            <th className="px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {news.map(n => (
            <tr key={n.id} className="border-t">
              <td className="px-6 py-4">{n.judul}</td>
              <td className="px-6 py-4">
                <button onClick={() => handleEdit(n)} className="text-indigo-600 mr-4">Edit</button>
                <button onClick={() => handleDelete(n.id)} className="text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}