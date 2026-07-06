import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getFacilities, IMAGE_URL } from '../services/api'
import { IoBusinessOutline, IoClose } from 'react-icons/io5'

export default function Facilities() {
  const [fac, setFac] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [availability, setAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedFacility, setSelectedFacility] = useState(null)

  useEffect(() => {
    getFacilities().then(data => {
      setFac(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filteredFacilities = fac
    .filter(item => item.status_aktif !== false)
    .filter(item => {
      const keyword = searchText.trim().toLowerCase()
      if (!keyword) return true
      return [item.nama, item.deskripsi]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(keyword))
    })
    .filter(item => {
      if (availability === 'available') return Number(item.jumlah_tersedia || 0) > 0
      if (availability === 'unavailable') return Number(item.jumlah_tersedia || 0) === 0
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.harga_mulai || 0) - Number(b.harga_mulai || 0)
      if (sortBy === 'price-high') return Number(b.harga_mulai || 0) - Number(a.harga_mulai || 0)
      return String(a.nama || '').localeCompare(String(b.nama || ''), 'id-ID')
    })

  // Tutup modal saat tekan ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedFacility(null)
    }
    if (selectedFacility) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [selectedFacility])

  const openModal = (facility) => {
    setSelectedFacility(facility)
  }

  const closeModal = () => {
    setSelectedFacility(null)
  }

  return (
    <div>
      <div className="page-banner">
        <h1>Fasilitas Kami</h1>
        <p>Fasilitas modern dan lengkap untuk kenyamanan perawatan Anda</p>
      </div>

      <div className="section">
        <div className="container">
          {/* Filter */}
          <div className="filter-bar">
            <div className="filter-grid filter-grid-3">
              <div>
                <label className="filter-label">Cari Fasilitas</label>
                <input
                  type="text"
                  placeholder="Ketik nama fasilitas..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="filter-input"
                />
              </div>
              <div>
                <label className="filter-label">Ketersediaan</label>
                <select value={availability} onChange={e => setAvailability(e.target.value)} className="filter-select">
                  <option value="all">Semua</option>
                  <option value="available">Tersedia</option>
                  <option value="unavailable">Tidak Tersedia</option>
                </select>
              </div>
              <div>
                <label className="filter-label">Urutkan</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
                  <option value="name">Nama A-Z</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                </select>
              </div>
            </div>
            <p className="filter-count">
              Menampilkan {filteredFacilities.length} dari {fac.filter(i => i.status_aktif !== false).length} fasilitas
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : filteredFacilities.length > 0 ? (
            <div className="cards-grid cards-grid-3">
              {filteredFacilities.map(f => (
                <div key={f.id} className="card facility-card" style={{ cursor: 'pointer' }} onClick={() => openModal(f)}>
                  {f.gambar ? (
                    <img src={`${IMAGE_URL}${f.gambar}`} alt={f.nama} className="card-img" />
                  ) : (
                    <div className="card-img-placeholder"><IoBusinessOutline /></div>
                  )}
                  <div className="card-body">
                    <h3>{f.nama}</h3>
                    <p className="line-clamp-3" style={{ marginBottom: 12 }}>{f.deskripsi}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="price-tag">
                        {f.harga_mulai ? `Mulai Rp ${Number(f.harga_mulai).toLocaleString('id-ID')}` : 'Hubungi kami'}
                      </span>
                      <span className={Number(f.jumlah_tersedia || 0) > 0 ? 'badge-available' : 'badge-unavailable'}>
                        {Number(f.jumlah_tersedia || 0) > 0 ? `${f.jumlah_tersedia} tersedia` : 'Penuh'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <IoBusinessOutline size={48} />
              <p>Tidak ada fasilitas ditemukan</p>
              <span>Coba ubah filter pencarian Anda</span>
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
