import { Link } from 'react-router-dom'
import { IoLocationOutline, IoCallOutline, IoTimeOutline } from 'react-icons/io5'
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import logoImg from '../assets/logo_rs.jpg'

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/pkumuhsragen/',
    icon: FaFacebook,
    label: 'Facebook RSU PKU Muhammadiyah Sragen',
    color: '#1877F2',
  },
  {
    href: 'https://www.instagram.com/rspkumuhammadiyahsragen?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    icon: FaInstagram,
    label: 'Instagram RSU PKU Muhammadiyah Sragen',
    color: '#E1306C',
  },
  {
    href: 'https://youtube.com/@rsupkumuhammadiyahsragen4154?si=ushqGYeh3KafYkWA',
    icon: FaYoutube,
    label: 'YouTube RSU PKU Muhammadiyah Sragen',
    color: '#FF0000',
  },
  {
    href: 'https://www.tiktok.com/@pkumuhammadiyahsragen',
    icon: FaTiktok,
    label: 'TikTok RSU PKU Muhammadiyah Sragen',
    color: '#010101',
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand & Social */}
        <div>
          <div className="footer-brand">
            <img src={logoImg} alt="Logo RSU PKU" />
            <div className="footer-brand-name">RSU PKU Muhammadiyah Sragen</div>
          </div>
          <p>
            Memberikan pelayanan kesehatan terpercaya dengan fasilitas modern dan tim medis profesional untuk masyarakat Sragen dan sekitarnya.
          </p>

          {/* Social Media Icons */}
          <div className="footer-social">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="footer-social-btn"
                style={{ '--social-color': color }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4>Navigasi</h4>
          <ul className="footer-links">
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/doctors">Dokter</Link></li>
            <li><Link to="/schedule">Jadwal Praktik</Link></li>
            <li><Link to="/layanan">Layanan</Link></li>
            <li><Link to="/news">Berita</Link></li>
            <li><Link to="/promotions">Promo</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4>Kontak</h4>
          <a href="https://maps.app.goo.gl/sy7FMsGSJTnPt7jv6?g_st=ac" target="_blank" rel="noreferrer" className="footer-contact-item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <IoLocationOutline size={16} />
            <span>Jl. Raya Sragen - Solo No.Km. 8, Kebayanan 1, Masaran, Kec. Masaran, Kabupaten Sragen, Jawa Tengah</span>
          </a>
          <div className="footer-contact-item">
            <IoCallOutline size={16} />
            <span>Pendaftaran: 087878091132</span>
          </div>
          <div className="footer-contact-item">
            <IoCallOutline size={16} />
            <span>Humas: +62 813-2675-7487</span>
          </div>
          <div className="footer-contact-item">
            <IoTimeOutline size={16} />
            <span>Senin - Jumat: 09:00 - 18:00<br/>Sabtu: 09:00 - 14:00</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} RSU PKU Muhammadiyah Sragen. All rights reserved.
      </div>
    </footer>
  )
}