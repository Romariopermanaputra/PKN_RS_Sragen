import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// ─── Konfigurasi statistik ───────────────────────────────────────────────────
const statsConfig = [
  {
    key: 'doctors',
    label: 'Total Dokter',
    meta: 'Tenaga medis terdaftar',
    icon: 'stethoscope',
    color: 'forest',
    path: '/admin/doctors',
  },
  {
    key: 'news',
    label: 'Total Berita',
    meta: 'Artikel dipublikasikan',
    icon: 'news',
    color: 'leaf',
    path: '/admin/news',
  },
  {
    key: 'facilities',
    label: 'Fasilitas',
    meta: 'Unit layanan aktif',
    icon: 'building-hospital',
    color: 'sage',
    path: '/admin/facilities',
  },
  {
    key: 'promotions',
    label: 'Total Promosi',
    meta: 'Promosi terdaftar',
    icon: 'discount-2',
    color: 'forest',
    path: '/admin/promotions',
  },
  {
    key: 'achievements',
    label: 'Prestasi',
    meta: 'Penghargaan tercatat',
    icon: 'award',
    color: 'leaf',
    path: '/admin/achievements',
  },
  {
    key: 'schedules',
    label: 'Jadwal Praktek',
    meta: 'Slot jadwal aktif',
    icon: 'calendar-event',
    color: 'sage',
    path: '/admin/schedules',
  },
];

const colorMap = {
  forest: {
    bg: 'bg-[#F2EDC2]',
    text: 'text-[#346739]',
    border: 'border-[#346739]/20',
    gradient: 'from-[#346739] to-[#79AE6F]',
  },
  leaf: {
    bg: 'bg-[#E9F3E4]',
    text: 'text-[#346739]',
    border: 'border-[#79AE6F]/30',
    gradient: 'from-[#79AE6F] to-[#9FCB98]',
  },
  sage: {
    bg: 'bg-[#F6F4D8]',
    text: 'text-[#346739]',
    border: 'border-[#9FCB98]/40',
    gradient: 'from-[#9FCB98] to-[#F2EDC2]',
  },
};



const quickActions = [
  {
    icon: 'user-plus',
    label: 'Tambah Dokter',
    desc: 'Tambahkan dokter baru',
    path: '/admin/doctors',
    color: 'forest',
  },
  {
    icon: 'file-plus',
    label: 'Buat Berita',
    desc: 'Publikasi artikel baru',
    path: '/admin/news',
    color: 'leaf',
  },
  {
    icon: 'building-plus',
    label: 'Kelola Fasilitas',
    desc: 'Atur unit layanan',
    path: '/admin/facilities',
    color: 'sage',
  },
  {
    icon: 'discount-2',
    label: 'Kelola Promosi',
    desc: 'Atur promo dan diskon',
    path: '/admin/promotions',
    color: 'forest',
  },
  {
    icon: 'award',
    label: 'Kelola Prestasi',
    desc: 'Tambah penghargaan',
    path: '/admin/achievements',
    color: 'leaf',
  },
  {
    icon: 'calendar-plus',
    label: 'Jadwal Praktek',
    desc: 'Atur jadwal dokter',
    path: '/admin/schedules',
    color: 'sage',
  },
];

// ─── Komponen Stat Card ───────────────────────────────────────────────────────
const StatCard = ({ config, value, isLoading }) => {
  const colors = colorMap[config.color];

  return (
    <Link
      to={config.path}
      className={`relative overflow-hidden bg-white rounded-xl border ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 p-5 group block`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div
            className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${colors.bg} ${colors.text} mb-3 group-hover:scale-110 transition-transform duration-300`}
          >
            <i className={`ti ti-${config.icon} text-xl`} />
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-[#9FCB98]/30 rounded w-20" />
              <div className="h-7 bg-[#9FCB98]/30 rounded w-12" />
              <div className="h-2 bg-[#9FCB98]/30 rounded w-28" />
            </div>
          ) : (
            <>
              <p className="text-xs font-medium text-[#346739]/75 mb-1">{config.label}</p>
              <p className="text-3xl font-bold text-[#254d2a] mb-1">{value ?? 0}</p>
              <p className="text-xs text-[#346739]/55">{config.meta}</p>
            </>
          )}
        </div>

        <div
          className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${colors.gradient} opacity-20 rounded-full group-hover:scale-150 transition-transform duration-500`}
        />
      </div>
    </Link>
  );
};

// ─── Format waktu relatif ─────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Komponen Activity Item ───────────────────────────────────────────────────
const ActivityItem = ({ activity, isLast }) => (
  <li className="relative flex items-start gap-4 py-3 last:pb-0 group">
    <div className="relative flex-shrink-0">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: activity.color }}
      >
        <i className={`ti ti-${activity.icon} text-white text-sm`} />
      </div>
      {!isLast && (
        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#9FCB98]/40" />
      )}
    </div>

    <div className="flex-1 min-w-0 pb-2">
      <p className="text-sm font-medium text-[#254d2a] group-hover:text-[#346739] transition-colors line-clamp-2">
        {activity.text}
      </p>
      {activity.created_at && (
        <p className="text-xs text-[#346739]/55 flex items-center gap-1 mt-1">
          <i className="ti ti-clock text-xs" />
          {timeAgo(activity.created_at)}
        </p>
      )}
    </div>
  </li>
);



// ─── Komponen Quick Action Card ───────────────────────────────────────────────
const QuickActionCard = ({ action }) => {
  const colorClasses = {
    forest: 'hover:border-[#346739]/40 hover:bg-[#F2EDC2]/40',
    leaf: 'hover:border-[#79AE6F]/50 hover:bg-[#9FCB98]/20',
    sage: 'hover:border-[#9FCB98]/60 hover:bg-[#F2EDC2]/30',
  };
  const iconColors = {
    forest: 'bg-[#F2EDC2] text-[#346739]',
    leaf: 'bg-[#E9F3E4] text-[#346739]',
    sage: 'bg-[#F6F4D8] text-[#346739]',
  };

  return (
    <Link
      to={action.path}
      className={`flex items-center gap-3 p-3 rounded-lg border border-[#346739]/10 bg-white ${colorClasses[action.color]} transition-all duration-200 group shadow-sm`}
    >
      <div
        className={`w-10 h-10 rounded-lg ${iconColors[action.color]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
      >
        <i className={`ti ti-${action.icon} text-lg`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#254d2a] group-hover:text-[#346739]">{action.label}</p>
        <p className="text-xs text-[#346739]/55">{action.desc}</p>
      </div>
      <i className="ti ti-chevron-right text-[#79AE6F] group-hover:text-[#346739] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
    </Link>
  );
};

// ─── Halaman Dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    news: 0,
    facilities: 0,
    promotions: 0,
    achievements: 0,
    schedules: 0,
  });
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
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Fallback: fetch individual endpoints jika dashboard belum ada
      try {
        const [doctorsRes, newsRes, facilitiesRes, promotionsRes, achievementsRes, schedulesRes] =
          await Promise.allSettled([
            api.get('/doctors'),
            api.get('/news'),
            api.get('/facilities'),
            api.get('/promotions'),
            api.get('/achievements'),
            api.get('/schedules'),
          ]);
        setStats({
          doctors: doctorsRes.value?.data?.length ?? 0,
          news: newsRes.value?.data?.length ?? 0,
          facilities: facilitiesRes.value?.data?.length ?? 0,
          promotions: promotionsRes.value?.data?.length ?? 0,
          achievements: achievementsRes.value?.data?.length ?? 0,
          schedules: schedulesRes.value?.data?.length ?? 0,
        });
        setLastUpdated(new Date());
      } catch (fallbackErr) {
        console.error('Fallback fetch juga gagal:', fallbackErr);
      }
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoadingActivities(true);
      const res = await api.get('/admin/dashboard/activities');
      setActivities(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivities();

    // Auto-refresh setiap 30 detik
    const statsInterval = setInterval(fetchStats, 30000);
    const activitiesInterval = setInterval(fetchActivities, 30000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(activitiesInterval);
    };
  }, [fetchStats, fetchActivities]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2EDC2]/70 via-[#F7F8EA] to-white p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* ── Header ── */}
        <div className="relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#346739] rounded-xl p-6 lg:p-8 shadow-xl">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#79AE6F]/45 to-transparent" />
          <div className="relative">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Dashboard Admin</h1>
            <p className="text-[#F2EDC2] text-sm">Pantau semua aktivitas sistem kesehatan</p>
          </div>

          <div className="relative flex items-center gap-3 bg-white/95 px-4 py-3 rounded-lg shadow-sm border border-[#F2EDC2]">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-[#79AE6F] rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-[#79AE6F] rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#346739]">Sistem Aktif</p>
              <p className="text-xs text-[#346739]/70">{lastUpdated.toLocaleTimeString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* ── Statistik (6 kartu) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsConfig.map((config) => (
            <StatCard
              key={config.key}
              config={config}
              value={stats[config.key]}
              isLoading={isLoadingStats}
            />
          ))}
        </div>

        {/* ── Aktivitas Terbaru + Aksi Cepat ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-xl shadow-sm border border-[#346739]/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F2EDC2] flex items-center justify-center">
                  <i className="ti ti-activity text-[#346739] text-lg" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#254d2a]">Aktivitas Terbaru</h2>
                  <p className="text-xs text-[#346739]/55">Update real-time sistem</p>
                </div>
              </div>
              <button
                onClick={fetchActivities}
                className="text-xs text-[#346739] hover:text-[#254d2a] font-medium flex items-center gap-1 hover:underline transition-colors"
                title="Refresh aktivitas"
              >
                <i className="ti ti-refresh text-xs" />
                Refresh
              </button>
            </div>

            {isLoadingActivities ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-[#9FCB98]/30 flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-[#9FCB98]/30 rounded w-3/4" />
                      <div className="h-2 bg-[#9FCB98]/20 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F2EDC2] flex items-center justify-center mb-3">
                  <i className="ti ti-clock-off text-[#346739] text-2xl" />
                </div>
                <p className="text-sm font-medium text-[#254d2a]">Belum ada aktivitas</p>
                <p className="text-xs text-[#346739]/55 mt-1">
                  Aktivitas akan muncul setelah data ditambahkan
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {activities.map((activity, index) => (
                  <ActivityItem
                    key={`${activity.type}-${activity.id_proxy ?? index}`}
                    activity={activity}
                    isLast={index === activities.length - 1}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Aksi Cepat */}
          <div className="bg-white rounded-xl shadow-sm border border-[#346739]/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#E9F3E4] flex items-center justify-center">
                <i className="ti ti-bolt text-[#346739] text-lg" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#254d2a]">Aksi Cepat</h2>
                <p className="text-xs text-[#346739]/55">Menu navigasi cepat</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <QuickActionCard key={action.path} action={action} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center text-xs text-[#346739]/50 pt-2 border-t border-[#346739]/10">
          <p>© 2026 Sistem Manajemen RSU PKU Muhammadiyah Sragen. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
