import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getNews, IMAGE_URL } from '../services/api'
import { IoNewspaperOutline, IoAlertCircleOutline, IoClose, IoCalendarOutline } from 'react-icons/io5'

export default function News() {
  const location = useLocation()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [brokenImages, setBrokenImages] = useState({})
  const [selectedNews, setSelectedNews] = useState(location.state?.selectedNews || null)

  useEffect(() => {
    getNews()
      .then(data => {
        setNews(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch news:', err)
        setError('Gagal memuat berita. Silakan cek koneksi atau coba lagi nanti.')
        setLoading(false)
      })
  }, [])

  // Tutup modal saat tekan ESC & kunci scroll body
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedNews(null)
    }
    if (selectedNews) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
      // Scroll to top when modal opens so it's not cut off on desktop
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [selectedNews])

  // Helper untuk format tanggal
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

  // Helper untuk menangani gambar yang error
  const handleImageError = (newsId) => {
    setBrokenImages(prev => ({ ...prev, [newsId]: true }))
  }

  const openModal = (newsItem) => {
    setSelectedNews(newsItem)
  }

  const closeModal = () => {
    setSelectedNews(null)
  }

  return (
    <div>
      {/* Page Banner */}
      <div className="page-banner">
        <h1>Berita Terkini</h1>
        <p>Informasi terbaru seputar kegiatan dan layanan RSU PKU Muhammadiyah Sragen</p>
      </div>

      <div className="section">
        <div className="container">
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : error ? (
            <div className="empty-state" style={{ marginTop: '40px', color: 'var(--danger, #e74c3c)' }}>
              <IoAlertCircleOutline size={48} />
              <p>{error}</p>
            </div>
          ) : news.length > 0 ? (
            <div className="cards-grid cards-grid-3">
              {news.map(n => (
                <article 
                  key={n.id} 
                  className="card news-card" 
                  onClick={() => openModal(n)}
                >
                  {n.gambar && !brokenImages[n.id] ? (
                    <img 
                      src={`${IMAGE_URL}${n.gambar}`} 
                      alt={n.judul} 
                      className="card-img" 
                      onError={() => handleImageError(n.id)}
                    />
                  ) : (
                    <div className="card-img-placeholder"><IoNewspaperOutline size={48} /></div>
                  )}
                  
                  <div className="card-body">
                    <span className="card-tag">Berita</span>
                    <div className="card-date">
                      <IoCalendarOutline style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      {formatDate(n.tanggal)}
                    </div>
                    <h3>{n.judul}</h3>
                    
                    <p className="line-clamp-3" style={{ fontSize: '0.88rem' }}>
                      {n.isi}
                    </p>
                    
                    <div className="news-view-more">
                      <span>Baca Selengkapnya</span>
                      <span className="arrow">→</span>
                    </div>
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

      {/* Modal Detail Berita */}
      {selectedNews && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal news-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="modal-image-container">
              {selectedNews.gambar && !brokenImages[selectedNews.id] ? (
                <img 
                  src={`${IMAGE_URL}${selectedNews.gambar}`} 
                  alt={selectedNews.judul} 
                  className="modal-image"
                  onError={() => handleImageError(selectedNews.id)}
                />
              ) : (
                <div className="modal-image-placeholder">
                  <IoNewspaperOutline size={64} />
                </div>
              )}
            </div>
            
            <div className="modal-content">
              <span className="modal-tag">Berita Terbaru</span>
              <h2 className="modal-title">{selectedNews.judul}</h2>
              
              <div className="modal-date">
                <IoCalendarOutline />
                <span>Diterbitkan pada {formatDate(selectedNews.tanggal)}</span>
              </div>
              
              <div className="modal-description">
                <h3>Isi Berita</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedNews.isi}</p>
              </div>
              
              <div className="modal-actions">
                <button onClick={closeModal} className="btn btn-primary btn-lg">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}