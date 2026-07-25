import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoctorById, IMAGE_URL } from '../services/api'
import {
  IoPersonOutline, IoArrowBackOutline, IoCalendarOutline,
  IoSchoolOutline, IoBriefcaseOutline, IoRibbonOutline, IoChevronDownOutline
} from 'react-icons/io5'

// Komponen Accordion mirip RS JIH
function AccordionSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '20px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px', background: 'var(--primary-dark)', border: 'none', cursor: 'pointer',
          color: 'white', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon size={20} /> {title}
        </span>
        <IoChevronDownOutline
          size={20}
          style={{ transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div style={{ padding: '24px 28px', animation: 'fadeIn 0.2s ease' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Parse data yang tersimpan sebagai JSON string atau plain text
function parseListData(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return [String(parsed)]
  } catch {
    // jika bukan JSON, anggap plain text — tiap baris jadi item
    return raw.split('\n').map(s => s.trim()).filter(Boolean)
  }
}

export default function DoctorProfile() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoctorById(id)
      .then(data => { setDoctor(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

  const renderScheduleTable = (schedules) => (
    <div className="schedule-table-wrapper" style={{ marginTop: '24px' }}>
      <table className="schedule-table">
        <thead>
          <tr>{days.map(day => <th key={day}>{day}</th>)}</tr>
        </thead>
        <tbody>
          <tr>
            {days.map(day => {
              const daySchedules = schedules.filter(s => s.hari === day)
              return (
                <td key={day}>
                  {daySchedules.length > 0 ? daySchedules.map((ds, idx) => (
                    <div key={idx} style={{ marginBottom: idx < daySchedules.length - 1 ? '8px' : 0 }}>
                      {ds.jam_mulai} - {ds.jam_selesai}
                      {ds.nama_poli && <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>{ds.nama_poli}</div>}
                    </div>
                  )) : <span style={{ color: 'var(--text-light)', opacity: 0.5 }}>-</span>}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )

  if (loading) return <div className="loading-spinner" style={{ padding: '100px 0' }}><div className="spinner" /></div>

  if (!doctor) return (
    <div className="empty-state" style={{ padding: '100px 0' }}>
      <IoPersonOutline size={48} />
      <p>Dokter tidak ditemukan</p>
      <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>Kembali ke Daftar Dokter</Link>
    </div>
  )

  const pendidikanList = parseListData(doctor.pendidikan)
  const pengalamanList = parseListData(doctor.pengalaman)
  const pelatihanList  = parseListData(doctor.pelatihan)

  return (
    <div>
      <div className="page-banner" style={{ padding: '60px 24px', textAlign: 'left', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
        <div className="container">
          <Link to="/doctors" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.9, textDecoration: 'none', fontWeight: 500 }}>
            <IoArrowBackOutline /> Kembali ke Daftar Dokter
          </Link>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Profil Dokter</h1>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>

          {/* Top Profile Card */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ width: '280px', flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--primary-pale)' }}>
              {doctor.foto ? (
                <img src={`${IMAGE_URL}${doctor.foto}`} alt={doctor.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '6rem', opacity: 0.5 }}>
                  <IoPersonOutline />
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.85rem', fontWeight: 600, padding: '6px 16px', borderRadius: '4px', display: 'inline-block', marginBottom: '16px' }}>
                {doctor.spesialis}{doctor.subspesialis ? ` - ${doctor.subspesialis}` : ''}
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '20px' }}>{doctor.nama}</h2>

              {doctor.deskripsi && (
                <>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-heading)' }}>Profil &amp; Biografi</h3>
                  <div style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {doctor.deskripsi}
                  </div>
                </>
              )}

              <div style={{ marginTop: '28px' }}>
                <a
                  href={`https://wa.me/6287878091132?text=${encodeURIComponent(`Halo, saya ingin mendaftar booking jadwal untuk dokter ${doctor.nama}`)}`}
                  target="_blank" rel="noreferrer"
                  className="btn btn-primary"
                >
                  Booking Sekarang
                </a>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <AccordionSection title="PENDIDIKAN" icon={IoSchoolOutline} defaultOpen={true}>
            {pendidikanList.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {pendidikanList.map((item, i) => (
                  <li key={i} style={{ padding: '10px 0', borderBottom: i < pendidikanList.length - 1 ? '1px solid #f0f0f0' : 'none', color: 'var(--text)', fontSize: '0.95rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>Maaf, data tidak tersedia</p>
            )}
          </AccordionSection>

          <AccordionSection title="PENGALAMAN" icon={IoBriefcaseOutline} defaultOpen={true}>
            {pengalamanList.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {pengalamanList.map((item, i) => (
                  <li key={i} style={{ padding: '10px 0', borderBottom: i < pengalamanList.length - 1 ? '1px solid #f0f0f0' : 'none', color: 'var(--text)', fontSize: '0.95rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>Maaf, data tidak tersedia</p>
            )}
          </AccordionSection>

          <AccordionSection title="PELATIHAN" icon={IoRibbonOutline} defaultOpen={true}>
            {pelatihanList.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {pelatihanList.map((item, i) => (
                  <li key={i} style={{ padding: '10px 0', borderBottom: i < pelatihanList.length - 1 ? '1px solid #f0f0f0' : 'none', color: 'var(--text)', fontSize: '0.95rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>Maaf, data tidak tersedia</p>
            )}
          </AccordionSection>

          {/* Schedule Section */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '32px 28px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IoCalendarOutline /> Jadwal Praktik
            </h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '0', fontSize: '0.9rem' }}>
              Jadwal dapat berubah sewaktu-waktu. Silakan hubungi bagian pendaftaran untuk konfirmasi.
            </p>

            {doctor.schedules && doctor.schedules.length > 0 ? (
              renderScheduleTable(doctor.schedules)
            ) : (
              <div style={{ background: 'var(--accent-light)', color: '#92600B', padding: '16px 24px', borderRadius: 'var(--radius-sm)', border: '1px solid #F0E68C', marginTop: '20px' }}>
                Jadwal belum tersedia untuk dokter ini.
              </div>
            )}

            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
              <a
                href={`https://wa.me/6287878091132?text=${encodeURIComponent(`Halo, saya ingin mendaftar booking jadwal untuk dokter ${doctor.nama}`)}`}
                target="_blank" rel="noreferrer"
                className="btn btn-primary btn-lg"
              >
                Booking Jadwal Sekarang
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
