import { useParams, Link, Navigate } from 'react-router-dom'
import { IoArrowBackOutline, IoPlayOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import heroImg3 from '../assets/hero3.png'

const servicesData = {
  'trauma-center': {
    title: 'Trauma Center (One Day Service)',
    description: 'Adalah layanan cepat, akurat, dan lengkap untuk menangani pasien pasca kecelakaan agar segera mendapatkan pertolongan.',
    features: [
      'Siaga 24 jam dengan tim terlatih kegawatdaruratan',
      'Penanganan cepat pasca kecelakaan lalu lintas atau kerja',
      'Fasilitas radiologi dan ruang operasi emergency terintegrasi',
      'Kolaborasi multidisiplin dokter spesialis',
      'Layanan penjemputan ambulans gawat darurat'
    ]
  },
  'ct-scan': {
    title: 'CT Scan',
    description: 'Adalah perlengkapan modern untuk menunjukkan gambar organ dalam yang jauh lebih presisi dan detail dibandingkan dengan rontgen konvensional.',
    features: [
      'Pencitraan medis resolusi dan presisi tinggi',
      'Diagnosis penyakit dan cedera internal lebih akurat',
      'Proses pemindaian cepat dan nyaman bagi pasien',
      'Peralatan modern berteknologi terkini',
      'Didukung oleh dokter spesialis radiologi berpengalaman'
    ]
  },
  'hemodialisa': {
    title: 'Hemodialisa',
    description: 'Adalah layanan cuci darah untuk menangani pasien gagal ginjal dengan menggunakan perlengkapan yang steril, canggih, dan modern.',
    features: [
      'Peralatan canggih dengan standar sterilisasi tinggi',
      'Ruang perawatan yang sangat nyaman selama proses cuci darah',
      'Didukung oleh dokter spesialis penyakit dalam dan perawat bersertifikat',
      'Monitoring ketat kondisi pasien selama prosedur',
      'Pelayanan yang ramah dan bersahabat'
    ]
  },
  'usg-4-dimensi': {
    title: 'USG 4 Dimensi',
    description: 'Adalah layanan medis yang dilakukan pada masa kehamilan untuk mendapat video pergerakan bayi dalam rahim. Prosedur ini dapat memberikan gambaran yang tidak terlihat pada USG 2D maupun 3D.',
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
  
  const service = servicesData[id]
  
  // Jika ID layanan tidak ditemukan, kembali ke halaman utama
  if (!service) {
    return <Navigate to="/" replace />
  }

  const otherServices = Object.keys(servicesData).filter(key => key !== id)

  return (
    <div>
      <div className="page-banner" style={{ padding: '80px 24px', textAlign: 'left', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
        <div className="container">
          <Link to="/" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.9, textDecoration: 'none', fontWeight: 500 }}>
            <IoArrowBackOutline /> Kembali
          </Link>
          <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{service.title}</h1>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }} className="service-detail-layout">
            <div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text)', marginBottom: '32px' }}>
                {service.description}
              </p>
              
              <h3 style={{ marginTop: '32px', marginBottom: '20px', color: 'var(--primary)', fontSize: '1.5rem' }}>Keunggulan Layanan</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '40px' }}>
                {service.features.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '1.05rem', color: 'var(--text)' }}>
                    <IoCheckmarkCircleOutline style={{ color: 'var(--primary)', fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div style={{ background: '#E8F5E9', padding: '30px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.2rem' }}>Informasi Pendaftaran</h4>
                <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.6' }}>
                  Untuk pendaftaran dan informasi lebih lanjut mengenai layanan <strong>{service.title}</strong>, silakan hubungi 
                  Pendaftaran kami di <strong>087878091132</strong> atau klik tombol di bawah ini.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <a href="https://wa.me/6287878091132" target="_blank" rel="noreferrer" className="btn btn-primary">
                    Hubungi Kami via WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <img src={heroImg3} alt={service.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }} />
              
              <div style={{ background: 'var(--primary-dark)', color: 'white', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.1rem' }}>Layanan Lainnya</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {otherServices.map(key => (
                    <Link key={key} to={`/service/${key}`} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <IoPlayOutline /> {servicesData[key].title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tambahan style untuk responsive pada Service Detail */}
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
