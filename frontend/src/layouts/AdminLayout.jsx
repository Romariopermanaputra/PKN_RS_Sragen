import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IoMenu, IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'layout-dashboard' },
  { path: '/admin/doctors', label: 'Dokter', icon: 'stethoscope' },
  { path: '/admin/schedules', label: 'Jadwal Praktik', icon: 'calendar-time' },
  { path: '/admin/news', label: 'Berita', icon: 'news' },
  { path: '/admin/achievements', label: 'Prestasi', icon: 'trophy' },
  { path: '/admin/promotions', label: 'Promo', icon: 'discount' },
  { path: '/admin/contact', label: 'Kontak', icon: 'address-book' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', backgroundColor: '#f7f5df', flexDirection: 'row'}}>
      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: '1001',
          background: '#F2EDC2',
          border: '1px solid rgba(52,103,57,0.2)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          fontSize: '24px',
          color: '#346739',
          boxShadow: '0 12px 30px rgba(52,103,57,0.18)'
        }}
        className="admin-mobile-menu-btn"
      >
        {sidebarOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: '998',
            display: 'none'
          }}
          className="admin-overlay"
        />
      )}

      {/* Sidebar */}
      <aside 
        style={{
          width: sidebarCollapsed ? '80px' : '256px',
          background: 'linear-gradient(180deg, #346739 0%, #28512d 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'width 0.3s ease, transform 0.3s ease',
          boxShadow: '18px 0 45px rgba(52,103,57,0.18)',
          zIndex: '999'
        }}
        className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        <div style={{
          padding: sidebarCollapsed ? '22px 10px' : '22px 18px',
          borderBottom: '1px solid rgba(242,237,194,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarCollapsed ? 'center' : 'flex-start',
          position: 'relative',
          transition: 'all 0.3s'
        }}>
          {/* Toggle Button for Desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              position: 'absolute',
              top: '22px',
              right: sidebarCollapsed ? '50%' : '18px',
              transform: sidebarCollapsed ? 'translateX(50%)' : 'none',
              background: 'rgba(242,237,194,0.15)',
              border: 'none',
              color: '#F2EDC2',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: '10',
              transition: 'all 0.2s'
            }}
            className="desktop-toggle-btn"
            title={sidebarCollapsed ? "Perluas menu" : "Tutup menu"}
          >
            {sidebarCollapsed ? <IoChevronForward size={16} /> : <IoChevronBack size={16} />}
          </button>

          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#F2EDC2',
            color: '#346739',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: sidebarCollapsed ? '0' : '12px',
            marginTop: sidebarCollapsed ? '40px' : '0',
            boxShadow: '0 14px 28px rgba(0,0,0,0.14)',
            transition: 'all 0.3s'
          }}>
            <i className="ti ti-heartbeat" style={{fontSize: '24px'}} />
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-text" style={{ overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}>
              <div style={{fontSize: '21px', fontWeight: '800', lineHeight: 1.15}}>Admin Panel</div>
              <div style={{fontSize: '12px', color: '#F2EDC2', marginTop: '6px'}}>RSU PKU Muhammadiyah Sragen</div>
            </div>
          )}
        </div>
        <nav style={{
          flex: '1',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto'
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className="admin-nav-link"
                title={sidebarCollapsed ? item.label : ""}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  gap: sidebarCollapsed ? '0' : '10px',
                  padding: sidebarCollapsed ? '12px 0' : '12px 14px',
                  borderRadius: '8px',
                  color: isActive ? '#346739' : 'rgba(255,255,255,0.9)',
                  textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s, transform 0.2s',
                  backgroundColor: isActive ? '#F2EDC2' : 'transparent',
                  boxShadow: isActive ? '0 12px 26px rgba(0,0,0,0.14)' : 'none',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <i className={`ti ti-${item.icon}`} style={{fontSize: '20px'}} />
                {!sidebarCollapsed && <span className="sidebar-text" style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(242,237,194,0.18)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button 
            onClick={handleLogout}
            title={sidebarCollapsed ? "Logout" : ""}
            style={{
              width: sidebarCollapsed ? '42px' : '100%',
              height: sidebarCollapsed ? '42px' : 'auto',
              backgroundColor: '#F2EDC2',
              padding: sidebarCollapsed ? '0' : '12px 16px',
              borderRadius: '8px',
              color: '#346739',
              border: '1px solid rgba(242,237,194,0.35)',
              cursor: 'pointer',
              transition: 'background 0.2s, width 0.3s ease',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#9FCB98'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#F2EDC2'}
          >
            <i className="ti ti-logout" style={{ fontSize: '18px' }} />
            {!sidebarCollapsed && <span className="sidebar-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: '1',
        padding: '32px 24px',
        overflowY: 'auto',
        maxHeight: '100vh',
        background: 'linear-gradient(135deg, #f7f5df 0%, #eef6e8 48%, #ffffff 100%)'
      }} className="admin-main">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-nav-link:hover {
          background: rgba(242,237,194,0.14) !important;
          color: #ffffff !important;
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .desktop-toggle-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .admin-mobile-menu-btn {
            display: block !important;
          }

          .admin-overlay {
            display: block !important;
          }

          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            height: 100vh;
            width: 256px !important;
            z-index: 999;
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          
          .admin-sidebar .sidebar-text {
            display: block !important;
          }

          .admin-main {
            padding: 60px 16px 24px 16px;
          }
        }

        @media (max-width: 640px) {
          .admin-main {
            padding: 60px 12px 16px 12px;
          }

          .admin-sidebar {
            width: 230px !important;
          }
        }
      `}</style>
    </div>
  );
}
