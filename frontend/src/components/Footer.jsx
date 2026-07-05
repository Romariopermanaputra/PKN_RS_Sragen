import { Link } from 'react-router-dom'
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from 'react-icons/io5'
import logoImg from '../assets/logo_rs.jpg'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand & Description */}
        <div>
          <div className="footer-brand">
            <img src={logoImg} alt="Logo RSU PKU" />
            <div className="footer-brand-name">RSU PKU Muhammadiyah Sragen</div>
          </div>
          <p>
            Memberikan pelayanan kesehatan terpercaya dengan fasilitas modern dan tim medis profesional untuk masyarakat Sragen dan sekitarnya.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4>Navigasi</h4>
          <ul className="footer-links">
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/doctors">Dokter</Link></li>
            <li><Link to="/schedule">Jadwal Praktek</Link></li>
            <li><Link to="/facilities">Fasilitas</Link></li>
            <li><Link to="/news">Berita</Link></li>
            <li><Link to="/promotions">Promo</Link></li>
          </ul>
        </div>

        {/* Layanan */}
        <div>
          <h4>Layanan</h4>
          <ul className="footer-links">
            <li><Link to="/facilities">IGD 24 Jam</Link></li>
            <li><Link to="/facilities">Rawat Inap</Link></li>
            <li><Link to="/facilities">Poliklinik</Link></li>
            <li><Link to="/facilities">Laboratorium</Link></li>
            <li><Link to="/achievements">Prestasi</Link></li>
            <li><Link to="/contact">Hubungi Kami</Link></li>
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