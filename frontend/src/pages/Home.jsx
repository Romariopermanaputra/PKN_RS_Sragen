import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { Pagination, EffectCoverflow } from 'swiper/modules'
import api, { getNews, getPromotions, getAchievements, IMAGE_URL } from '../services/api'
import gedungImg from '../assets/gedung_pku.png'
import kamarImg from '../assets/kamar.png'
import dokterImg from '../assets/dokter.jpg'
import logoImg from '../assets/logo_rs.jpg'
import {
  IoSearchOutline,
  IoCalendarOutline,
  IoLogoWhatsapp,
  IoShieldCheckmarkOutline,
  IoMedkitOutline,
  IoPeopleOutline,
  IoBusinessOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoArrowForwardOutline,
  IoTrophyOutline,
  IoPlayOutline,
  IoNewspaperOutline,
  IoClose,
  IoGiftOutline,
} from 'react-icons/io5'

const heroSlides = [
  {
    image: gedungImg,
    title: 'Layanan Kesehatan Terpercaya untuk Anda & Keluarga',
    subtitle: 'RSU PKU Muhammadiyah Sragen hadir memberikan pelayanan kesehatan komprehensif dengan fasilitas modern dan tim dokter profesional.',
  },
  {
    image: dokterImg,
    title: 'Tim Dokter Profesional & Berpengalaman',
    subtitle: 'Didukung oleh lebih dari 70 dokter spesialis berpengalaman dari berbagai bidang keahlian medis.',
  },
  {
    image: kamarImg,
    title: 'Fasilitas Modern & Ruang Perawatan Nyaman',
    subtitle: 'Dilengkapi peralatan medis terkini dan ruang perawatan yang nyaman untuk proses pemulihan optimal.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [promos, setPromos] = useState([])
  const [achievements, setAchievements] = useState([])
  const [linktree, setLinktree] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedNews, setSelectedNews] = useState(null)
  const [selectedPromo, setSelectedPromo] = useState(null)
  const [brokenImages, setBrokenImages] = useState({})

  // Swipe logic
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const minSwipeDistance = 50

  useEffect(() => {
    getNews().then(setNews).catch(() => {})
    getPromotions().then(setPromos).catch(() => {})
    getAchievements().then(setAchievements).catch(() => {})
    api.get('/settings/linktree').then(res => setLinktree(res.data.linktree_url)).catch(() => {})
  }, [])

  // Auto-slide carousel
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) nextSlide()
    if (distance < -minSwipeDistance) prevSlide()
  }

  // Tutup modal saat tekan ESC & kunci scroll body
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedNews(null)
        setSelectedPromo(null)
      }
    }
    if (selectedNews || selectedPromo) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [selectedNews, selectedPromo])

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia'
    try {
      return new Date(dateString).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    } catch {
      return 'Tanggal tidak valid'
    }
  }

  const handleImageError = (newsId) => {
    setBrokenImages(prev => ({ ...prev, [newsId]: true }))
  }

  const openModal = (newsItem) => {
    setSelectedNews(newsItem)
  }

  const closeModal = () => {
    setSelectedNews(null)
    setSelectedPromo(null)
  }

  return (
    <div>
      {/* ===== HERO CAROUSEL ===== */}
      <section 
        className="hero-carousel" 
        id="hero-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {heroSlides.map((slide, idx) => (
          <div key={idx} className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.title} />
            <div className="hero-overlay">
              <div className="hero-text">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="hero-actions">
                  <a className="btn btn-accent btn-lg" href={linktree || 'https://wa.me/6287878091132'} target="_blank" rel="noreferrer">
                    Booking Sekarang
                  </a>
                  <Link className="btn btn-outline btn-lg" to="/schedule">
                    Lihat Jadwal Dokter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="hero-arrow prev" onClick={prevSlide} aria-label="Previous slide">
          <IoChevronBackOutline />
        </button>
        <button className="hero-arrow next" onClick={nextSlide} aria-label="Next slide">
          <IoChevronForwardOutline />
        </button>
      </section>

      {/* ===== QUICK LINKS ===== */}
      <section className="quick-links">
        <div className="container">
          <div className="quick-links-grid">
            <Link to="/doctors" className="quick-link-card" id="quick-link-doctors">
              <div className="quick-link-icon"><IoSearchOutline /></div>
              <div className="quick-link-content">
                <h3>Cari Dokter</h3>
                <p>Temukan dokter spesialis sesuai kebutuhan Anda</p>
              </div>
            </Link>
            <Link to="/schedule" className="quick-link-card" id="quick-link-schedule">
              <div className="quick-link-icon"><IoCalendarOutline /></div>
              <div className="quick-link-content">
                <h3>Jadwal Dokter</h3>
                <p>Lihat jadwal praktek dan poliklinik tersedia</p>
              </div>
            </Link>
            <a href={linktree || 'https://wa.me/6287878091132'} target="_blank" rel="noreferrer" className="quick-link-card" id="quick-link-whatsapp">
              <div className="quick-link-icon" style={{ background: '#E8F5E9', color: '#25D366' }}>
                <IoLogoWhatsapp />
              </div>
              <div className="quick-link-content">
                <h3>WhatsApp</h3>
                <p>Hubungi kami langsung via WhatsApp</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ===== KENAPA MEMILIH KAMI ===== */}
      <section className="section" id="why-choose-us">
        <div className="container">
          <div className="why-section">
            <div className="why-content">
              <div className="section-header" style={{ textAlign: 'left', marginBottom: 24 }}>
                <span className="section-label">Tentang Kami</span>
                <h2>Kenapa Memilih RSU PKU Muhammadiyah Sragen?</h2>
              </div>
              <p>
                RSU PKU Muhammadiyah Sragen adalah rumah sakit yang berkomitmen memberikan pelayanan kesehatan berkualitas tinggi dengan mengedepankan nilai-nilai Islam, kemanusiaan, dan profesionalisme.
              </p>
              <p>
                Dengan dukungan tim medis yang berpengalaman dan fasilitas modern, kami siap melayani kebutuhan kesehatan masyarakat Sragen dan sekitarnya secara komprehensif.
              </p>
              <Link to="/facilities" className="btn btn-primary" style={{ marginTop: 8 }}>
                Temukan Layanan <IoArrowForwardOutline />
              </Link>
            </div>
            <div className="why-image">
              <img src={logoImg} alt="RSU PKU Muhammadiyah Sragen" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="section section-brand-green" id="features-section">
        <div className="container">
          <div className="features-grid-green">
            <div className="feature-card-green">
              <div className="feature-icon-green"><IoPeopleOutline /></div>
              <h3>Tenaga Medis Profesional</h3>
              <p>Didukung dokter spesialis profesional dan berpengalaman dari berbagai spesialisasi medis.</p>
            </div>
            <div className="feature-card-green">
              <div className="feature-icon-green"><IoMedkitOutline /></div>
              <h3>Peralatan Medis Lengkap</h3>
              <p>Selalu berinovasi dengan menghadirkan peralatan medis baru, modern, dan canggih.</p>
            </div>
            <div className="feature-card-green">
              <div className="feature-icon-green"><IoBusinessOutline /></div>
              <h3>Rekam Medis Elektronik</h3>
              <p>Menerapkan rekam medis elektronik untuk meminimalkan kesalahan dan meningkatkan efisiensi layanan.</p>
            </div>
            <div className="feature-card-green">
              <div className="feature-icon-green"><IoShieldCheckmarkOutline /></div>
              <h3>24 Jam Emergency</h3>
              <p>Unit gawat darurat dan tenaga medis selalu siaga melayani selama 24 jam penuh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LAYANAN UNGGULAN (Tabs) ===== */}
      <section className="section" id="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Layanan</span>
            <h2>Layanan Unggulan Kami</h2>
            <p>Pilih kategori layanan untuk melihat detail</p>
          </div>

          <div className="layanan-unggulan-layout">
              <div className="layanan-unggulan-links">
                <Link to="/layanan/trauma-center" className="service-pill">
                  <span>Trauma Center (One Day Service)</span>
                  <div className="service-pill-icon"><IoPlayOutline /></div>
                </Link>
                <Link to="/layanan/ct-scan" className="service-pill">
                  <span>CT Scan</span>
                  <div className="service-pill-icon"><IoPlayOutline /></div>
                </Link>
                <Link to="/layanan/hemodialisa" className="service-pill">
                  <span>Hemodialisa</span>
                  <div className="service-pill-icon"><IoPlayOutline /></div>
                </Link>
                <Link to="/layanan/usg-4-dimensi" className="service-pill">
                  <span>USG 4 Dimensi</span>
                  <div className="service-pill-icon"><IoPlayOutline /></div>
                </Link>
              </div>
              <div className="layanan-unggulan-img">
                <img src={kamarImg} alt="Layanan Unggulan" className="layanan-unggulan-image" />
              </div>
            </div>
        </div>
      </section>

      {/* ===== BERITA TERBARU ===== */}
      <section className="section section-alt" id="news-section">
        <div className="container">
          <div className="section-header-left">
            <div>
              <span className="section-label" style={{ marginBottom: 10, display: 'inline-block' }}>Informasi</span>
              <h2>Berita Terbaru</h2>
            </div>
            <Link to="/news" className="btn btn-outline-dark btn-sm">
              Lihat Semua <IoArrowForwardOutline />
            </Link>
          </div>

          <div className="cards-grid cards-grid-3">
            {news.length > 0 ? news.slice(0, 3).map(n => (
              <article 
                key={n.id} 
                className="card" 
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(n)}
              >
                {n.gambar ? (
                  <img src={`${IMAGE_URL}${n.gambar}`} alt={n.judul} className="card-img" />
                ) : (
                  <div className="card-img-placeholder"><IoBusinessOutline /></div>
                )}
                <div className="card-body">
                  <div className="card-date">{new Date(n.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <h3>{n.judul}</h3>
                  <p className="line-clamp-2">{n.isi}</p>
                </div>
              </article>
            )) : (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <p>Belum ada berita terbaru.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== PROMO ===== */}
      {promos.length > 0 && (
        <section className="section" id="promo-section" style={{ backgroundColor: '#f9fafb' }}>
          <div className="container">
            <div className="promo-top-header">
              <h2 className="promo-jih-title">Promo Menarik</h2>
              <Link to="/promotions" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Lihat Semua Promo <IoArrowForwardOutline />
              </Link>
            </div>
          </div>
          <div className="promo-swiper-wrap">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              slidesPerView={'auto'}
              centeredSlides={true}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
                scale: 0.82
              }}
              pagination={{ clickable: true }}
              modules={[Pagination, EffectCoverflow]}
              className="promo-swiper"
            >
              {promos.map(p => (
                <SwiperSlide key={p.id} className="promo-swiper-slide">
                  <div className="promo-img-only" onClick={() => setSelectedPromo(p)}>
                    {p.gambar ? (
                      <img src={`${IMAGE_URL}${p.gambar}`} alt={p.judul} />
                    ) : (
                      <div className="card-img-placeholder"><IoMedkitOutline size={48} /></div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ===== PRESTASI ===== */}
      {achievements.length > 0 && (
        <section className="section section-alt" id="achievements-section">
          <div className="container">
            <div className="section-header-left">
              <div>
                <span className="section-label" style={{ marginBottom: 10, display: 'inline-block' }}>Pencapaian</span>
                <h2>Prestasi Kami</h2>
              </div>
              <Link to="/achievements" className="btn btn-outline-dark btn-sm">
                Lihat Semua <IoArrowForwardOutline />
              </Link>
            </div>
            <div className="cards-grid cards-grid-3">
              {achievements.slice(0, 3).map(a => (
                <div key={a.id} className="card">
                  {a.gambar ? (
                    <img src={`${IMAGE_URL}${a.gambar}`} alt={a.judul} className="card-img" />
                  ) : (
                    <div className="card-img-placeholder"><IoTrophyOutline /></div>
                  )}
                  <div className="card-body">
                    {a.tahun && <span className="card-tag">{a.tahun}</span>}
                    <h3>{a.judul}</h3>
                    <p className="line-clamp-2">{a.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="section" id="cta-section">
        <div className="container">
          <div className="cta-section">
            <h2>Butuh Bantuan Kesehatan?</h2>
            <p>Hubungi kami sekarang untuk konsultasi, booking jadwal dokter, atau informasi layanan lainnya.</p>
            <div className="cta-links">
              <Link to="/doctors" className="btn btn-accent btn-lg">
                <IoSearchOutline /> Cari Dokter
              </Link>
              <Link to="/schedule" className="btn btn-outline btn-lg">
                <IoCalendarOutline /> Jadwal Dokter
              </Link>
              <a href={linktree || 'https://wa.me/6287878091132'} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">
                <IoLogoWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Detail Berita */}
      {selectedNews && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal news-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="modal-image-container">
              {selectedNews.gambar && !brokenImages[selectedNews.id] ? (
                <img 
                  src={`${IMAGE_URL}${selectedNews.gambar}`} 
                  alt={selectedNews.judul} 
                  className="modal-image"
                  onError={() => handleImageError(selectedNews.id)}
                />
              ) : (
                <div className="modal-image-placeholder">
                  <IoNewspaperOutline size={64} />
                </div>
              )}
            </div>
            
            <div className="modal-content">
              <span className="modal-tag">Berita Terbaru</span>
              <h2 className="modal-title">{selectedNews.judul}</h2>
              
              <div className="modal-date">
                <IoCalendarOutline />
                <span>Diterbitkan pada {formatDate(selectedNews.tanggal)}</span>
              </div>
              
              <div className="modal-description">
                <h3>Isi Berita</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedNews.isi}</p>
              </div>
              
              <div className="modal-actions">
                <button onClick={closeModal} className="btn btn-primary btn-lg">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Detail Promo */}
      {selectedPromo && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal promo-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="modal-image-container">
              {selectedPromo.gambar ? (
                <img 
                  src={`${IMAGE_URL}${selectedPromo.gambar}`} 
                  alt={selectedPromo.judul} 
                  className="modal-image"
                />
              ) : (
                <div className="modal-image-placeholder">
                  <IoGiftOutline size={64} />
                </div>
              )}
            </div>
            
            <div className="modal-content">
              <span className="modal-tag">Promo Spesial</span>
              <h2 className="modal-title">{selectedPromo.judul}</h2>
              
              {selectedPromo.tanggal_berakhir && (
                <div className="modal-date">
                  <IoCalendarOutline />
                  <span>Berlaku sampai {new Date(selectedPromo.tanggal_berakhir).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
              )}
              
              <div className="modal-description">
                <h3>Deskripsi Promo</h3>
                <p>{selectedPromo.deskripsi}</p>
              </div>
              
              {selectedPromo.syarat_ketentuan && (
                <div className="modal-terms">
                  <h3>Syarat & Ketentuan</h3>
                  <p>{selectedPromo.syarat_ketentuan}</p>
                </div>
              )}
              
              <div className="modal-actions">
                <button onClick={closeModal} className="btn btn-primary btn-lg">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}

function IoTimeOutline(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={props.size || 24} height={props.size || 24} fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
      <path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z" />
      <path d="M256 128v144h96" />
    </svg>
  )
}