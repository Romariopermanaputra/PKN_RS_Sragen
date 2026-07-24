import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getFacilities, IMAGE_URL } from '../services/api'
import { IoBusinessOutline, IoClose } from 'react-icons/io5'

export default function Facilities() {
  const [fac, setFac] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFacility, setSelectedFacility] = useState(null)

  useEffect(() => {
    getFacilities().then(data => {
      setFac(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeFacilities = fac.filter(item => item.status_aktif !== false)

  const openModal = (facility) => {
    setSelectedFacility(facility)
  }

  const closeModal = () => {
    setSelectedFacility(null)
  }

  return (
    <div>
      <div className="page-banner" style={{ textAlign: 'left', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', padding: '80px 24px', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '16px', fontWeight: 'bold' }}>Layanan Khusus RSU PKU Muhammadiyah Sragen</h1>
          <p style={{ color: 'white', fontSize: '1.1rem', opacity: 0.9, maxWidth: '800px', lineHeight: 1.6 }}>
            RSU PKU Muhammadiyah Sragen selalu berkomitmen menghadirkan inovasi layanan untuk pasien. Didukung oleh Dokter, Perawat, Paramedis dan Staf yang profesional dan ramah melayani pasien. Serta didukung dengan peralatan medis modern dan terbaru, kami yakin RSU PKU Muhammadiyah Sragen akan selalu menjadi pilihan Anda dan Keluarga.
          </p>
        </div>
      </div>

      <div className="section" style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="container">
          {/* Grid */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : activeFacilities.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
              {activeFacilities.map(f => (
                <div key={f.id} className="card facility-card" style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', background: 'white', transition: 'transform 0.3s ease' }} onClick={() => openModal(f)}>
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#e2e8f0' }}>
                    {f.gambar ? (
                      <img src={`${IMAGE_URL}${f.gambar}`} alt={f.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <IoBusinessOutline size={64} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>{f.nama}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '80px 0', background: 'white', borderRadius: '16px' }}>
              <IoBusinessOutline size={48} style={{ color: '#cbd5e1' }} />
              <p style={{ marginTop: '16px', color: '#64748b' }}>Tidak ada layanan khusus ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Layanan/Fasilitas */}
      {selectedFacility && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal facility-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="modal-image-container">
              {selectedFacility.gambar ? (
                <img 
                  src={`${IMAGE_URL}${selectedFacility.gambar}`} 
                  alt={selectedFacility.nama} 
                  className="modal-image"
                />
              ) : (
                <div className="modal-image-placeholder">
                  <IoBusinessOutline size={64} />
                </div>
              )}
            </div>
            
            <div className="modal-content">
              <span className="modal-tag">Fasilitas & Layanan</span>
              <h2 className="modal-title">{selectedFacility.nama}</h2>
              
              <div className="modal-description">
                <h3>Deskripsi</h3>
                <p>{selectedFacility.deskripsi || 'Tidak ada deskripsi.'}</p>
              </div>
              
              {(selectedFacility.harga_mulai || selectedFacility.jumlah_tersedia !== undefined) && (
                <div className="modal-terms" style={{ marginTop: 24, display: 'flex', gap: 24 }}>
                  {selectedFacility.harga_mulai && (
                    <div>
                      <h3>Harga Mulai</h3>
                      <p className="price-tag" style={{ fontSize: '1.2rem', margin: 0 }}>
                        Rp {Number(selectedFacility.harga_mulai).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                  {selectedFacility.jumlah_tersedia !== undefined && (
                    <div>
                      <h3>Status</h3>
                      <p className={Number(selectedFacility.jumlah_tersedia || 0) > 0 ? 'badge-available' : 'badge-unavailable'} style={{ fontSize: '1rem', padding: '6px 12px' }}>
                        {Number(selectedFacility.jumlah_tersedia || 0) > 0 ? `${selectedFacility.jumlah_tersedia} tersedia` : 'Penuh'}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-actions" style={{ marginTop: 32 }}>
                <button onClick={closeModal} className="btn btn-primary btn-lg">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
