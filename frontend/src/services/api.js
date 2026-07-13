import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'https://pkn-rs-sragen-backend.vercel.app/api'
// Mengarahkan gambar langsung ke Supabase Storage Public URL
export const IMAGE_URL = 'https://qaqhqyzwwumlvkpvbjfy.supabase.co/storage/v1/object/public/uploads/';

const api = axios.create({
  baseURL: base,
  // ✅ PERBAIKAN UTAMA: 
  // HAPUS baris 'headers: { "Content-Type": "application/json" }' dari sini.
  // Biarkan Axios mendeteksi Content-Type secara otomatis.
  // Jika dikirim objek biasa -> otomatis jadi application/json
  // Jika dikirim FormData -> otomatis jadi multipart/form-data (dengan boundary yang benar)
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const normalizeDoctor = (doctor) => ({
  ...doctor,
  id: doctor?.id_dokter ?? doctor?.id,
  nama: doctor?.nama_lengkap ?? doctor?.nama ?? doctor?.name ?? 'Dokter',
  spesialis: doctor?.spesialis?.nama_spesialis ?? doctor?.spesialis ?? doctor?.specialty ?? '',
  subspesialis: doctor?.subspesialis?.nama_subspesialis ?? doctor?.subspesialis ?? '',
  foto: doctor?.foto_url ?? doctor?.foto ?? null,
  deskripsi: doctor?.deskripsi ?? doctor?.description ?? null,
  status_aktif: doctor?.status_aktif ?? true,
  schedules: Array.isArray(doctor?.schedules ?? doctor?.jadwal_praktek)
    ? (doctor?.schedules ?? doctor?.jadwal_praktek).map((schedule) => ({
        id: schedule?.id_jadwal ?? schedule?.id,
        hari: schedule?.hari ?? schedule?.day ?? '',
        jam_mulai: schedule?.jam_mulai ?? '',
        jam_selesai: schedule?.jam_selesai ?? '',
        nama_poli: schedule?.nama_poli ?? schedule?.poliklinik ?? '',
      }))
    : [],
})

const normalizeDoctors = (payload) => {
  if (Array.isArray(payload)) return payload.map(normalizeDoctor)
  if (payload && Array.isArray(payload.data)) return payload.data.map(normalizeDoctor)
  return []
}

export const getDoctors = async () => {
  const res = await api.get('/doctors')
  return normalizeDoctors(res.data)
}

export const getDoctorById = async (id) => {
  const res = await api.get(`/doctors/${id}`)
  return normalizeDoctor(res.data)
}

export const getSpecialties = async () => {
  const res = await api.get('/doctors/specialties')
  return Array.isArray(res.data) ? res.data : []
}

export const getSubspecialties = async () => {
  const res = await api.get('/doctors/subspecialties')
  return Array.isArray(res.data) ? res.data : []
}

export const getNews = async () => {
  const res = await api.get('/news')
  return Array.isArray(res.data) ? res.data : []
}

export const getPromotions = async () => {
  const res = await api.get('/promotions')
  return Array.isArray(res.data) ? res.data : []
}

export const getFacilities = async () => {
  const res = await api.get('/facilities')
  return Array.isArray(res.data) ? res.data : []
}

export const getSchedule = async () => {
  const res = await api.get('/schedules')
  return Array.isArray(res.data) ? res.data : []
}

export const getAchievements = async () => {
  const res = await api.get('/achievements')
  return Array.isArray(res.data) ? res.data : []
}

export const sendContact = async (payload) => {
  const res = await api.post('/contact', payload)
  return res.data
}

export default api