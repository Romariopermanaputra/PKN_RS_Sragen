import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoctorById, IMAGE_URL } from '../services/api'
import { IoPersonOutline, IoArrowBackOutline, IoCalendarOutline } from 'react-icons/io5'

export default function DoctorProfile() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoctorById(id)
      .then(data => {
        setDoctor(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

  const renderScheduleTable = (schedules) => {
    return (
      <div className="schedule-table-wrapper" style={{ marginTop: '24px' }}>
        <table className="schedule-table">
          <thead>
            <tr>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map(day => {
                const daySchedules = schedules.filter(s => s.hari === day)
                return (
                  <td key={day}>
                    {daySchedules.length > 0 ? (
                      daySchedules.map((ds, idx) => (
                        <div key={idx} style={{ marginBottom: idx < daySchedules.length - 1 ? '8px' : 0 }}>
                          {ds.jam_mulai} - {ds.jam_selesai}
                          {ds.nama_poli && <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>{ds.nama_poli}</div>}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-light)', opacity: 0.5 }}>-</span>
                    )}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  if (loading) {
    return <div className="loading-spinner" style={{ padding: '100px 0' }}><div className="spinner" /></div>
  }

  if (!doctor) {
    return (
      <div className="empty-state" style={{ padding: '100px 0' }}>
        <IoPersonOutline size={48} />
        <p>Dokter tidak ditemukan</p>
        <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>Kembali ke Daftar Dokter</Link>
      </div>
    )
  }

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
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div style={{ width: '300px', flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--primary-pale)' }}>
              {doctor.foto ? (
                <img src={`${IMAGE_URL}${doctor.foto}`} alt={doctor.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '6rem', opacity: 0.5 }}>
                  <IoPersonOutline />
                </div>
              )}
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.85rem', fontWeight: 600, padding: '6px 16px', borderRadius: '4px', display: 'inline-block', marginBottom: '16px' }}>
                {doctor.spesialis} {doctor.subspesialis ? `- ${doctor.subspesialis}` : ''}
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>{doctor.nama}</h2>
              
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-heading)' }}>Profil & Biografi</h3>
              <div style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {doctor.deskripsi || `${doctor.nama} adalah dokter spesialis ${doctor.spesialis} di RSU PKU Muhammadiyah Sragen yang berdedikasi tinggi dalam melayani pasien.`}
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IoCalendarOutline /> Jadwal Praktik
            </h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Jadwal dapat berubah sewaktu-waktu. Silakan hubungi bagian pendaftaran untuk konfirmasi.</p>
            
            {doctor.schedules && doctor.schedules.length > 0 ? (
              renderScheduleTable(doctor.schedules)
            ) : (
              <div style={{ background: 'var(--accent-light)', color: '#92600B', padding: '16px 24px', borderRadius: 'var(--radius-sm)', border: '1px solid #F0E68C' }}>
                Jadwal belum tersedia untuk dokter ini.
              </div>
            )}
            
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
              <a 
                href={`https://wa.me/6287878091132?text=${encodeURIComponent(`Halo, saya ingin mendaftar booking jadwal untuk dokter ${doctor.nama}`)}`}
                target="_blank"
                rel="noreferrer"
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
