import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logoImg from '../assets/logo_rs.jpg'
import { IoMenu, IoClose, IoCallOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5'

export default function Navbar() {
  const [linktree, setLinktree] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const defaultLinktreeUrl = ''
    setLinktree(defaultLinktreeUrl)

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Tutup menu mobile saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) closeMobileMenu()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Top Bar - Semua info tampil lengkap di desktop & mobile */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <div className="top-bar-item">
              <IoTimeOutline size={14} />
              <span>UGD 24 Jam</span>
            </div>
            <div className="top-bar-item">
              <IoCallOutline size={14} />
              <span>Pendaftaran: 087878091132</span>
            </div>
            <div className="top-bar-item">
              <IoCallOutline size={14} />
              <span>Humas: +62 813-2675-7487</span>
            </div>
          </div>
          <div className="top-bar-right">
            <a
              href="https://maps.app.goo.gl/sy7FMsGSJTnPt7jv6?g_st=ac"
              target="_blank"
              rel="noreferrer"
              className="top-bar-item"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <IoLocationOutline size={14} />
              <span>Jl. Raya Sragen - Solo No.Km 8, Kebayanan 1, Kec.Masaran, Kab.Sragen</span>
            </a>
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

          {/* Tombol Hamburger - Hanya muncul di mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>

          {/* Menu Navigation - Hidden di mobile, tampil di desktop */}
          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {/* Tombol close di dalam menu mobile */}
            {mobileMenuOpen && (
              <button className="mobile-close-btn" onClick={closeMobileMenu}>
                <IoClose />
              </button>
            )}
            
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Beranda</NavLink>
            <NavLink to="/doctors" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Dokter</NavLink>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Jadwal</NavLink>
            <NavLink to="/news" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Berita</NavLink>
            <NavLink to="/promotions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Promo</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>Kontak</NavLink>
            
            <a
              className="nav-cta"
              href={linktree || 'https://wa.me/6287878091132'}
              target="_blank"
              rel="noreferrer"
              onClick={closeMobileMenu}
            >
              Booking Online
            </a>
          </nav>

          {/* Overlay gelap saat menu mobile terbuka */}
          <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu} />
        </div>
      </header>
    </>
  )
}