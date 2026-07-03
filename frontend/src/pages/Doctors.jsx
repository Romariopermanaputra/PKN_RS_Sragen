import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDoctors, getSpecialties, getSubspecialties, IMAGE_URL } from '../services/api'
import { IoSearchOutline, IoPersonOutline, IoArrowForwardOutline } from 'react-icons/io5'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [subspecialties, setSubspecialties] = useState([])
  
  // Filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedSubspecialty, setSelectedSubspecialty] = useState('')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      getDoctors().catch(() => []),
      getSpecialties().catch(() => []),
      getSubspecialties().catch(() => [])
    ]).then(([docs, specs, subspecs]) => {
      setDoctors(docs)
      setSpecialties(specs)
      setSubspecialties(subspecs)
      setLoading(false)
    })
  }, [])

  const filteredDoctors = doctors.filter(d => {
    const matchesSpecialty = !selectedSpecialty || d.spesialis === selectedSpecialty
    const matchesSubspecialty = !selectedSubspecialty || d.subspesialis === selectedSubspecialty
    const matchesSearch = !searchText || d.nama.toLowerCase().includes(searchText.toLowerCase())
    return matchesSpecialty && matchesSubspecialty && matchesSearch
  })

  return (
    <div>
      {/* Page Banner */}
      <div className="page-banner" style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '16px' }}>Cari Dokter Terbaik</h1>
        <p style={{ color: 'white', opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Temukan dokter spesialis sesuai kebutuhan kesehatan Anda
        </p>
      </div>

      <div className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          {/* Floating Search Bar */}
          <div className="floating-search-bar">
            <div>
              <input
                type="text"
                placeholder="Cari nama dokter Anda disini..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">Semua Spesialis</option>
                {specialties.map(spec => (
                  <option key={spec.id_spesialis} value={spec.nama_spesialis}>
                    {spec.nama_spesialis}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedSubspecialty}
                onChange={(e) => setSelectedSubspecialty(e.target.value)}
              >
                <option value="">Semua Subspesialis</option>
                {subspecialties.map(sub => (
                  <option key={sub.id_subspesialis} value={sub.nama_subspesialis}>
                    {sub.nama_subspesialis}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-search">
              CARI
            </button>
          </div>
          
          <div style={{ marginTop: '40px', marginBottom: '24px', color: 'var(--text-light)', fontSize: '0.95rem' }}>
            Menampilkan {filteredDoctors.length} dari {doctors.length} dokter
          </div>

          {/* Doctors Grid - Horizontal Cards */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : filteredDoctors.length > 0 ? (
            <div className="cards-grid cards-grid-2">
              {filteredDoctors.map(d => (
                <div key={d.id} className="doctor-card-horizontal">
                  <div className="doctor-card-img-container">
                    {d.foto ? (
                      <img src={`${IMAGE_URL}${d.foto}`} alt={d.nama} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '4rem', opacity: 0.5 }}>
                        <IoPersonOutline />
                      </div>
                    )}
                  </div>
                  <div className="doctor-card-content">
                    <span className="doctor-card-specialty">{d.spesialis}</span>
                    <h3 className="doctor-card-name">{d.nama}</h3>
                    
                    <p className="doctor-card-desc">
                      {d.deskripsi 
                        ? (d.deskripsi.length > 120 ? d.deskripsi.substring(0, 120) + '...' : d.deskripsi)
                        : `${d.nama} adalah dokter spesialis ${d.spesialis} yang berpengalaman dalam memberikan pelayanan kesehatan terbaik.`}
                    </p>
                    
                    <div className="doctor-card-actions">
                      <Link to={`/doctor/${d.id}`} className="doctor-card-link">
                        Lihat Jadwal <IoArrowForwardOutline />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <IoSearchOutline size={48} />
              <p>Tidak ada dokter ditemukan</p>
              <span>Coba ubah filter atau pencarian Anda</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}