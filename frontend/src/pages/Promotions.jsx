import { useEffect, useState } from 'react'
import { getPromotions, IMAGE_URL } from '../services/api'
import { IoGiftOutline, IoClose, IoCalendarOutline } from 'react-icons/io5'

export default function Promotions() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPromo, setSelectedPromo] = useState(null)

  useEffect(() => {
    getPromotions().then(data => {
      setPromos(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Tutup modal saat tekan ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedPromo(null)
    }
    if (selectedPromo) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [selectedPromo])

  const openModal = (promo) => {
    setSelectedPromo(promo)
  }

  const closeModal = () => {
    setSelectedPromo(null)
  }

  return (
    <div>
      <div className="page-banner">
        <h1>Promo & Layanan Spesial</h1>
        <p>Nikmati berbagai promo dan penawaran spesial dari RSU PKU Muhammadiyah Sragen</p>
      </div>

      <div className="section">
        <div className="container">
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : promos.length > 0 ? (
            <div className="cards-grid cards-grid-3">
              {promos.map(p => (
                <div key={p.id} className="card promo-card" onClick={() => openModal(p)}>
                  {p.gambar ? (
                    <img src={`${IMAGE_URL}${p.gambar}`} alt={p.judul} className="card-img" />
                  ) : (
                    <div className="card-img-placeholder"><IoGiftOutline /></div>
                  )}
                  <div className="card-body">
                    <span className="card-tag">Promo</span>
                    <h3>{p.judul}</h3>
                    <p className="line-clamp-3" style={{ fontSize: '0.88rem' }}>
                      {p.deskripsi}
                    </p>
                    {p.tanggal_berakhir && (
                      <div className="card-date" style={{ marginTop: 8 }}>
                        <IoCalendarOutline style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        Berlaku s/d {new Date(p.tanggal_berakhir).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    )}
                    <div className="promo-view-more">
                      <span>Lihat Detail</span>
                      <span className="arrow">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <IoGiftOutline size={48} />
              <p>Tidak ada promosi aktif saat ini</p>
              <span>Nantikan promo menarik dari kami</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Promo */}
      {selectedPromo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal promo-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="modal-image-container">
              {selectedPromo.gambar ? (
                <img 
                  src={`${IMAGE_URL}${selectedPromo.gambar}`} 
                  alt={selectedPromo.judul} 
                  className="modal-image"
                />
              ) : (
                <div className="modal-image-placeholder">
                  <IoGiftOutline size={64} />
                </div>
              )}
            </div>
            
            <div className="modal-content">
              <span className="modal-tag">Promo Spesial</span>
              <h2 className="modal-title">{selectedPromo.judul}</h2>
              
              {selectedPromo.tanggal_berakhir && (
                <div className="modal-date">
                  <IoCalendarOutline />
                  <span>Berlaku sampai {new Date(selectedPromo.tanggal_berakhir).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
              )}
              
              <div className="modal-description">
                <h3>Deskripsi Promo</h3>
                <p>{selectedPromo.deskripsi}</p>
              </div>
              
              {selectedPromo.syarat_ketentuan && (
                <div className="modal-terms">
                  <h3>Syarat & Ketentuan</h3>
                  <p>{selectedPromo.syarat_ketentuan}</p>
                </div>
              )}
              
              <div className="modal-actions">
                <a 
                  href="https://wa.me/6287878091132" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <IoGiftOutline /> Klaim Promo Sekarang
                </a>
                <button onClick={closeModal} className="btn btn-outline-dark btn-lg">
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