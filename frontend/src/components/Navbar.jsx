import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
// import api from '../services/api' // Bisa dikomentari jika tidak dipakai lagi di file ini
import logoImg from '../assets/logo_rs.jpg'
import { IoMenu, IoClose, IoCallOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5'

export default function Navbar() {
  const [linktree, setLinktree] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // ✅ PERBAIKAN: 
    // Kita matikan sementara pemanggilan API ke '/settings/linktree' 
    // karena tabel 'settings' belum ada di database Anda (penyebab error 500).
    
    // Silakan isi URL linktree/booking secara manual di bawah ini. 
    // Jika belum ada, biarkan kosong ('').
    const defaultLinktreeUrl = '' // Contoh: 'https://linktr.ee/rsu_pku_sragen'
    setLinktree(defaultLinktreeUrl)

    // CATATAN: Jika nanti rekan tim Anda sudah menambahkan tabel 'settings' ke database, 
    // Anda bisa menghapus baris di atas dan mengaktifkan kembali kode di bawah ini:
    /*
    api.get('/settings/linktree')
      .then(res => setLinktree(res.data.linktree_url || ''))
      .catch(() => setLinktree(''))
    */
    
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <div className="top-bar-item">
              <IoTimeOutline size={14} />
              <span>UGD 24 Jam</span>
            </div>
            <div className="top-bar-item">
              <IoCallOutline size={14} />
              <span>Call Center: (0271) 123-4567</span>
            </div>
          </div>
          <div className="top-bar-right">
            <div className="top-bar-item">
              <IoLocationOutline size={14} />
              <span>Jl. Raya Sukowati No. 534, Sragen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <img src={logoImg} alt="Logo RSU PKU Muhammadiyah Sragen" />
            <div className="navbar-brand-text">
              RSU PKU Muhammadiyah
              <span>Sragen</span>
            </div>
          </NavLink>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {mobileMenuOpen && (
              <button className="mobile-close-btn" onClick={closeMobileMenu}>
                <IoClose />
              </button>
            )}
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Beranda</NavLink>
            <NavLink to="/doctors" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Dokter</NavLink>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Jadwal</NavLink>
            <NavLink to="/facilities" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Fasilitas</NavLink>
            <NavLink to="/news" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Berita</NavLink>
            <NavLink to="/promotions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Promo</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Kontak</NavLink>
            <a className="nav-cta" href={linktree || "/contact"} target={linktree ? "_blank" : "_self"} rel="noreferrer" onClick={closeMobileMenu}>Booking Online</a>
          </nav>

          {/* Mobile overlay */}
          <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu} />
        </div>
      </header>
    </>
  )
}