import { useEffect, useState } from 'react'
import api from '../services/api'
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from 'react-icons/io5'

export default function Contact() {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/contact').then(res => {
      setContact(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-banner">
        <h1>Hubungi Kami</h1>
        <p>Kami siap melayani Anda. Jangan ragu untuk menghubungi kami.</p>
      </div>

      <div className="section">
        <div className="container">
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : (
            <div className="contact-grid">
              <div className="contact-info-card">
                <h3 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Informasi Kontak</h3>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><IoLocationOutline /></div>
                  <div className="contact-info-text">
                    <h4>Alamat</h4>
                    <p>{contact?.alamat || 'Jl. Raya Sragen - Solo No.Km. 8, Kebayanan 1, Masaran, Kec. Masaran, Kabupaten Sragen, Jawa Tengah'}</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><IoCallOutline /></div>
                  <div className="contact-info-text">
                    <h4>Telepon</h4>
                    <p>
                      Pendaftaran: 087878091132<br />
                      Humas: +62 813-2675-7487
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><IoTimeOutline /></div>
                  <div className="contact-info-text">
                    <h4>Jam Operasional</h4>
                    <p>
                      Senin - Jumat: 09:00 - 18:00<br />
                      Sabtu: 09:00 - 14:00<br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-map">
                {contact?.maps_link ? (
                  <iframe
                    src={contact.maps_link}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi RSU PKU Muhammadiyah Sragen"
                  />
                ) : (
                  <iframe
                    src="https://maps.google.com/maps?q=RSU%20PKU%20Muhammadiyah%20Masaran%20Sragen&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi RSU PKU Muhammadiyah Sragen"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
