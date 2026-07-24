import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { IoArrowBackOutline, IoPlayOutline, IoCheckmarkCircleOutline, IoBusinessOutline } from 'react-icons/io5'
import { getServiceBySlug, IMAGE_URL } from '../services/api'

// Fallback static data untuk 4 layanan unggulan yang sudah ada sebelumnya
const staticServicesData = {
  'trauma-center': {
    nama: 'Trauma Center (One Day Service)',
    deskripsi: 'Adalah layanan cepat, akurat, dan lengkap untuk menangani pasien pasca kecelakaan agar segera mendapatkan pertolongan.',
    deskripsi_lengkap: 'RSU PKU Muhammadiyah Sragen menyediakan Trauma Center dengan tim dokter spesialis bedah dan anestesi yang siap 24 jam.',
    features: [
      'Siaga 24 jam dengan tim terlatih kegawatdaruratan',
      'Penanganan cepat pasca kecelakaan lalu lintas atau kerja',
      'Fasilitas radiologi dan ruang operasi emergency terintegrasi',
      'Kolaborasi multidisiplin dokter spesialis',
      'Layanan penjemputan ambulans gawat darurat'
    ]
  },
  'ct-scan': {
    nama: 'CT Scan',
    deskripsi: 'Adalah perlengkapan modern untuk menunjukkan gambar organ dalam yang jauh lebih presisi dan detail.',
    deskripsi_lengkap: '',
    features: [
      'Pencitraan medis resolusi dan presisi tinggi',
      'Diagnosis penyakit dan cedera internal lebih akurat',
      'Proses pemindaian cepat dan nyaman bagi pasien',
      'Peralatan modern berteknologi terkini',
      'Didukung oleh dokter spesialis radiologi berpengalaman'
    ]
  },
  'hemodialisa': {
    nama: 'Hemodialisa',
    deskripsi: 'Adalah layanan cuci darah untuk menangani pasien gagal ginjal dengan menggunakan perlengkapan yang steril, canggih, dan modern.',
    deskripsi_lengkap: '',
    features: [
      'Peralatan canggih dengan standar sterilisasi tinggi',
      'Ruang perawatan yang sangat nyaman selama proses cuci darah',
      'Didukung oleh dokter spesialis penyakit dalam dan perawat bersertifikat',
      'Monitoring ketat kondisi pasien selama prosedur',
      'Pelayanan yang ramah dan bersahabat'
    ]
  },
  'usg-4-dimensi': {
    nama: 'USG 4 Dimensi',
    deskripsi: 'Adalah layanan medis yang dilakukan pada masa kehamilan untuk mendapat video pergerakan bayi dalam rahim.',
    deskripsi_lengkap: '',
    features: [
      'Tampilan visual janin lebih nyata dan jelas',
      'Dapat melihat gerakan bayi secara real-time (berupa video)',
      'Membantu mendeteksi kelainan bawaan sejak dini',
      'Prosedur sangat aman untuk ibu dan janin',
      'Menciptakan ikatan emosional (bonding) yang kuat bagi orang tua'
    ]
  }
}

export default function ServiceDetail() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [others, setOthers] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getServiceBySlug(id)
      .then(data => {
        setService(data)
        setOthers(data.others || [])
        setLoading(false)
      })
      .catch(() => {
        // Fallback ke static data
        const staticData = staticServicesData[id]
        if (staticData) {
          setService({
            nama: staticData.nama,
            deskripsi: staticData.deskripsi,
            deskripsi_lengkap: staticData.deskripsi_lengkap,
            features: staticData.features,
            gambar: null,
          })
          setOthers([])
          setLoading(false)
        } else {
          setNotFound(true)
          setLoading(false)
        }
      })
  }, [id])

  if (loading) {
    return <div className="loading-spinner" style={{ padding: '100px 0' }}><div className="spinner" /></div>
  }

  if (notFound || !service) {
    return (
      <div className="empty-state" style={{ padding: '100px 0' }}>
        <IoBusinessOutline size={48} />
        <p>Layanan tidak ditemukan</p>
        <Link to="/layanan" className="btn btn-primary" style={{ marginTop: '16px' }}>Kembali ke Layanan</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="page-banner" style={{ padding: '80px 24px', textAlign: 'left', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
        <div className="container">
          <Link to="/layanan" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.9, textDecoration: 'none', fontWeight: 500 }}>
            <IoArrowBackOutline /> Kembali ke Layanan
          </Link>
          <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{service.nama}</h1>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }} className="service-detail-layout">
            <div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text)', marginBottom: '32px' }}>
                {service.deskripsi_lengkap || service.deskripsi}
              </p>

              {service.features && service.features.length > 0 && (
                <>
                  <h3 style={{ marginTop: '32px', marginBottom: '20px', color: 'var(--primary)', fontSize: '1.5rem' }}>Keunggulan Layanan</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '40px' }}>
                    {service.features.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '1.05rem', color: 'var(--text)' }}>
                        <IoCheckmarkCircleOutline style={{ color: 'var(--primary)', fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div style={{ background: '#E8F5E9', padding: '30px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.2rem' }}>Informasi Pendaftaran</h4>
                <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.6' }}>
                  Untuk pendaftaran dan informasi lebih lanjut mengenai layanan <strong>{service.nama}</strong>, silakan hubungi
                  Pendaftaran kami di <strong>{service.kontak_darurat || '087878091132'}</strong> atau klik tombol di bawah ini.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <a href={`https://wa.me/62${(service.kontak_darurat || '087878091132').replace(/^0/, '')}`} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Hubungi Kami via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div>
              {service.gambar ? (
                <img src={`${IMAGE_URL}${service.gambar}`} alt={service.nama} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }} />
              ) : (
                <div style={{ width: '100%', height: '260px', background: '#e2e8f0', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: '24px' }}>
                  <IoBusinessOutline size={80} />
                </div>
              )}

              {others.length > 0 && (
                <div style={{ background: 'var(--primary-dark)', color: 'white', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.1rem' }}>Layanan Lainnya</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {others.slice(0, 5).map(other => (
                      <Link key={other.id} to={`/layanan/${other.slug || other.id}`} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <IoPlayOutline /> {other.nama}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .service-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
