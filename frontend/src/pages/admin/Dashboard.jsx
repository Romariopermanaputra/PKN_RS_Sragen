import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/admin.css';

const statsConfig = [
  { key: 'doctors',   label: 'Total Dokter',   meta: 'Tenaga medis aktif',      icon: 'stethoscope',  path: '/admin/doctors',    accent: '#346739', light: '#E9F3E4' },
  { key: 'news',      label: 'Berita',          meta: 'Artikel dipublikasikan',  icon: 'news',         path: '/admin/news',       accent: '#1d4ed8', light: '#dbeafe' },
  { key: 'promotions',label: 'Promosi',         meta: 'Promo terdaftar',         icon: 'discount-2',   path: '/admin/promotions', accent: '#7c3aed', light: '#ede9fe' },
  { key: 'schedules', label: 'Jadwal Praktik',  meta: 'Slot jadwal aktif',       icon: 'calendar-time',path: '/admin/schedules',  accent: '#be185d', light: '#fce7f3' },
];

const quickActions = [
  { icon: 'user-plus',    label: 'Tambah Dokter',    desc: 'Data dokter baru',        path: '/admin/doctors',     accent: '#346739', light: '#E9F3E4' },
  { icon: 'file-plus',    label: 'Tulis Berita',      desc: 'Publikasi artikel',       path: '/admin/news',        accent: '#1d4ed8', light: '#dbeafe' },
  { icon: 'discount-2',   label: 'Tambah Promo',      desc: 'Promo & penawaran',       path: '/admin/promotions',  accent: '#7c3aed', light: '#ede9fe' },
  { icon: 'calendar-plus',label: 'Jadwal Praktik',   desc: 'Atur jadwal dokter',      path: '/admin/schedules',   accent: '#be185d', light: '#fce7f3' },
];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
  const [stats, setStats] = useState({ doctors: 0, news: 0, promotions: 0, schedules: 0 });
  const [activities, setActivities] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const res = await api.get('/admin/dashboard/stats');
      setStats(res.data);
      setLastUpdated(new Date());
    } catch {
      try {
        const [doctorsRes, newsRes, promotionsRes, schedulesRes] =
          await Promise.allSettled([
            api.get('/doctors'),
            api.get('/news'),
            api.get('/promotions'),
            api.get('/schedules'),
          ]);
        setStats({
          doctors: doctorsRes.value?.data?.length ?? 0,
          news: newsRes.value?.data?.length ?? 0,
          promotions: promotionsRes.value?.data?.length ?? 0,
          schedules: schedulesRes.value?.data?.length ?? 0,
        });
        setLastUpdated(new Date());
      } catch (e) { console.error(e); }
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoadingActivities(true);
      const res = await api.get('/admin/dashboard/activities');
      setActivities(Array.isArray(res.data) ? res.data : []);
    } catch {
      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivities();
    const si = setInterval(fetchStats, 30000);
    const ai = setInterval(fetchActivities, 30000);
    return () => { clearInterval(si); clearInterval(ai); };
  }, [fetchStats, fetchActivities]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* ── Header Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a21 0%, #346739 60%, #4a8c51 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(52,103,57,0.25)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 140, height: 140, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div>
          <p style={{ color: '#9FCB98', fontSize: '0.8rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 4px' }}>RSU PKU Muhammadiyah Sragen</p>
          <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Dashboard Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>Pantau semua aktivitas sistem kesehatan</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 20px', textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#79AE6F', display: 'inline-block', boxShadow: '0 0 0 3px rgba(121,174,111,0.3)' }} />
            <span style={{ color: '#F2EDC2', fontSize: '0.8rem', fontWeight: 600 }}>Sistem Aktif</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', margin: 0 }}>
            Pembaruan: {lastUpdated.toLocaleTimeString('id-ID')}
          </p>
        </div>
      </div>

      {/* ── Statistik ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {statsConfig.map(cfg => (
          <Link key={cfg.key} to={cfg.path} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: '20px',
              border: `1.5px solid ${cfg.light}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: cfg.light, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <i className={`ti ti-${cfg.icon}`} style={{ fontSize: '1.3rem', color: cfg.accent }} />
              </div>
              {isLoadingStats ? (
                <div>
                  <div style={{ height: 10, background: '#f3f4f6', borderRadius: 6, width: '60%', marginBottom: 8 }} />
                  <div style={{ height: 28, background: '#f3f4f6', borderRadius: 6, width: '40%', marginBottom: 6 }} />
                  <div style={{ height: 8, background: '#f3f4f6', borderRadius: 6, width: '80%' }} />
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px' }}>{cfg.label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: cfg.accent, margin: '0 0 2px', lineHeight: 1 }}>{stats[cfg.key] ?? 0}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{cfg.meta}</p>
                </>
              )}
              <div style={{ position: 'absolute', right: -16, bottom: -16, width: 72, height: 72, borderRadius: '50%', background: cfg.light, opacity: 0.6 }} />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Aktivitas + Aksi Cepat ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Aktivitas Terbaru */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0fdf4', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#E9F3E4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-activity" style={{ color: '#346739', fontSize: '1.1rem' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#1e3a21', margin: 0, fontSize: '0.95rem' }}>Aktivitas Terbaru</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Update real-time</p>
              </div>
            </div>
            <button
              onClick={fetchActivities}
              style={{ background: '#E9F3E4', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#346739', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <i className="ti ti-refresh" style={{ fontSize: '0.85rem' }} /> Refresh
            </button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {isLoadingActivities ? (
              <div style={{ padding: 22 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, background: '#f3f4f6', borderRadius: 6, width: '70%', marginBottom: 6 }} />
                      <div style={{ height: 8, background: '#f3f4f6', borderRadius: 6, width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#E9F3E4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <i className="ti ti-clock-off" style={{ color: '#79AE6F', fontSize: '1.3rem' }} />
                </div>
                <p style={{ color: '#4b5563', fontWeight: 600, margin: '0 0 4px', fontSize: '0.9rem' }}>Belum ada aktivitas</p>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>Aktivitas akan muncul setelah data ditambahkan</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: '6px 0', margin: 0 }}>
                {activities.slice(0, 8).map((act, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 22px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: act.color || '#E9F3E4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`ti ti-${act.icon || 'point'}`} style={{ color: 'white', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e3a21', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.text}</p>
                      {act.created_at && <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{timeAgo(act.created_at)}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Aksi Cepat */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0fdf4', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0fdf4', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F2EDC2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-bolt" style={{ color: '#346739', fontSize: '1.1rem' }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#1e3a21', margin: 0, fontSize: '0.95rem' }}>Aksi Cepat</p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Navigasi cepat ke fitur utama</p>
            </div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map(action => (
              <Link key={action.path} to={action.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                  borderRadius: 12, border: '1.5px solid #f3f4f6', background: 'white',
                  transition: 'all 0.18s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = action.light; e.currentTarget.style.background = action.light; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.background = 'white'; }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: action.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ti-${action.icon}`} style={{ color: action.accent, fontSize: '1.1rem' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: '#1e3a21', margin: 0, fontSize: '0.875rem' }}>{action.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{action.desc}</p>
                  </div>
                  <i className="ti ti-chevron-right" style={{ color: '#d1d5db', fontSize: '1rem' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#d1d5db', marginTop: 32, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
        © {new Date().getFullYear()} Sistem Manajemen RSU PKU Muhammadiyah Sragen
      </p>
    </div>
  );
}
