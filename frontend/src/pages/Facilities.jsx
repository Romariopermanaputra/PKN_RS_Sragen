import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getServices, IMAGE_URL } from '../services/api'
import { IoBusinessOutline, IoArrowForwardOutline } from 'react-icons/io5'

export default function Facilities() {
  const [fac, setFac] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices().then(data => {
      setFac(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeFacilities = fac.filter(item => item.status_aktif !== false)

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
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : activeFacilities.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
              {activeFacilities.map(f => (
                <Link
                  key={f.id}
                  to={`/layanan/${f.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      background: 'white',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#e2e8f0' }}>
                      {f.gambar ? (
                        <img src={`${IMAGE_URL}${f.gambar}`} alt={f.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <IoBusinessOutline size={64} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>{f.nama}</h3>
                      <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Lihat Detail <IoArrowForwardOutline />
                      </span>
                    </div>
                  </div>
                </Link>
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
    </div>
  )
}
