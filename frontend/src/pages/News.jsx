import { useEffect, useState } from 'react'
import { getNews, IMAGE_URL } from '../services/api'
import { IoNewspaperOutline, IoAlertCircleOutline } from 'react-icons/io5'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // State untuk menandai gambar yang gagal dimuat (broken images)
  const [brokenImages, setBrokenImages] = useState({})

  useEffect(() => {
    getNews()
      .then(data => {
        // Pastikan data yang diterima adalah array
        setNews(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch news:', err)
        setError('Gagal memuat berita. Silakan cek koneksi atau coba lagi nanti.')
        setLoading(false)
      })
  }, [])

  // Helper untuk format tanggal agar aman dari error jika tanggal null/invalid
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia'
    try {
      return new Date(dateString).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    } catch {
      return 'Tanggal tidak valid'
    }
  }

  // Helper untuk menangani gambar yang error (404/not found)
  const handleImageError = (newsId) => {
    setBrokenImages(prev => ({ ...prev, [newsId]: true }))
  }

  return (
    <div>
      {/* Page Banner - Disesuaikan dengan style Doctors.jsx */}
      <div className="page-banner" style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '16px' }}>Berita Terkini</h1>
        <p style={{ color: 'white', opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Informasi terbaru seputar kegiatan dan layanan RSU PKU Muhammadiyah Sragen
        </p>
      </div>

      <div className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : error ? (
            // ✅ Tampilan jika terjadi error saat fetch data
            <div className="empty-state" style={{ marginTop: '40px', color: 'var(--danger, #e74c3c)' }}>
              <IoAlertCircleOutline size={48} />
              <p>{error}</p>
            </div>
          ) : news.length > 0 ? (
            <div className="cards-grid cards-grid-3">
              {news.map(n => (
                <article key={n.id} className="card">
                  {/* ✅ Logika gambar yang lebih aman */}
                  {n.gambar && !brokenImages[n.id] ? (
                    <img 
                      src={`${IMAGE_URL}${n.gambar}`} 
                      alt={n.judul} 
                      className="card-img" 
                      onError={() => handleImageError(n.id)} // Jika gambar error, tampilkan placeholder
                    />
                  ) : (
                    <div className="card-img-placeholder"><IoNewspaperOutline size={48} /></div>
                  )}
                  
                  <div className="card-body">
                    <div className="card-date">
                      {formatDate(n.tanggal)}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{n.judul}</h3>
                    
                    {/* Potong teks jika terlalu panjang agar card rapi */}
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-light)' }}>
                      {n.isi && n.isi.length > 100 ? n.isi.substring(0, 100) + '...' : n.isi}
                    </p>
                    
                    {/* Opsional: Tambahkan link ke halaman detail berita jika ada */}
                    {/* <Link to={`/news/${n.id}`} className="btn-read-more" style={{ marginTop: '12px', display: 'inline-block' }}>
                      Baca Selengkapnya
                    </Link> */}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <IoNewspaperOutline size={48} />
              <p>Belum ada berita tersedia</p>
              <span>Nantikan informasi terbaru dari kami</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}